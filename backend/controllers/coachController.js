const mongoose = require('mongoose');
const https = require('https');
const User = require('../models/User');
const Workout = require('../models/Workout');
const Meal = require('../models/Meal');

function getUserId(req) {
  return req.user?.userId || req.user?.id;
}

function fmtDate(d) {
  if (!d) return '';
  try { return new Date(d).toISOString().slice(0, 10); }
  catch { return String(d); }
}

async function loadProgressSince(userId, since) {
  try {
    const { ProgressEntry } = require('../models/Progress');
    if (!ProgressEntry) return [];
    return ProgressEntry.find({ userId: new mongoose.Types.ObjectId(userId), date: { $gte: since } })
      .sort({ date: -1 }).limit(10).lean();
  } catch { return []; }
}

async function buildContext(userId) {
  const uid = new mongoose.Types.ObjectId(userId);
  const since = new Date();
  since.setDate(since.getDate() - 7);
  since.setHours(0, 0, 0, 0);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [user, workouts7d, meals7d, workoutsToday, mealsToday, progress7d] = await Promise.all([
    User.findById(userId).select('-password').lean(),
    Workout.find({ userId: uid, date: { $gte: since } }).sort({ date: -1 }).lean(),
    Meal.find({ userId: uid, date: { $gte: since } }).sort({ date: -1 }).lean(),
    Workout.find({ userId: uid, date: { $gte: startOfToday } }).sort({ date: -1 }).lean(),
    Meal.find({ userId: uid, date: { $gte: startOfToday } }).sort({ date: -1 }).lean(),
    loadProgressSince(userId, since)
  ]);

  const caloriesToday = mealsToday.reduce((s, m) => s + (m.totalCalories || 0), 0);
  const workoutSummaryToday = workoutsToday.length === 0
    ? 'None logged today'
    : workoutsToday.map(w => `${w.name} (${w.duration} min)`).join('; ');

  const lines = [];
  lines.push(`Workouts this week: ${workouts7d.length}`);
  workouts7d.slice(0, 5).forEach(w => lines.push(`  - ${fmtDate(w.date)}: ${w.name}, ${w.duration} min`));
  lines.push(`Meals logged this week: ${meals7d.length}`);
  meals7d.slice(0, 5).forEach(m => lines.push(`  - ${fmtDate(m.date)}: ${m.name} (${m.mealType}), ~${m.totalCalories || 0} kcal`));
  if (progress7d.length) {
    progress7d.slice(0, 3).forEach(p => lines.push(`  - Weight on ${fmtDate(p.date)}: ${p.weight} kg`));
  }

  return {
    user,
    activitySummary: lines.join('\n') || 'No activity logged yet.',
    today: { calories: caloriesToday, workout: workoutSummaryToday }
  };
}

function buildSystemPrompt(ctx) {
  const u = ctx?.user || {};
  return `You are an expert AI Fitness Coach built into a fitness tracking app. You are like a combination of a personal trainer, nutritionist, and motivational coach.

USER PROFILE:
- Name: ${u.name || 'User'}
- Age: ${u.age || 'not set'}, Gender: ${u.gender || 'not set'}
- Height: ${u.height ? u.height + ' cm' : 'not set'}, Weight: ${u.weight ? u.weight + ' kg' : 'not set'}
- Fitness Goal: ${u.fitnessGoal || 'general fitness'}

RECENT ACTIVITY (last 7 days):
${ctx?.activitySummary || 'No data yet.'}

TODAY: ${ctx?.today?.calories || 0} kcal consumed | Workout: ${ctx?.today?.workout || 'none'}

YOUR BEHAVIOR:
- Answer EXACTLY what the user asks — never give a generic response
- Be conversational, warm, and specific like ChatGPT
- Use **bold** for key terms, bullet points for lists, numbered steps for plans
- Give real food names, real exercise names, real numbers (sets/reps/calories)
- Vary your responses — never repeat the same answer twice
- Short questions → concise answers. Detailed questions → detailed answers
- Reference the user's actual data when relevant
- Max 2 emojis per reply`;
}

// ── Direct HTTPS call to OpenAI (no npm package needed) ──────────────────────
function httpsPost(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        ...headers
      }
    };
    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', chunk => { raw += chunk; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(new Error('Request timeout')); });
    req.write(data);
    req.end();
  });
}

async function callOpenAI(systemPrompt, userPrompt, history = []) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.log('⚠️  No OPENAI_API_KEY in environment');
    return null;
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-16).map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: userPrompt }
  ];

  console.log(`🤖 Calling OpenAI ${model} (${messages.length} messages)...`);

  try {
    // Try npm package first (faster)
    let openaiPkg = null;
    try { openaiPkg = require('openai'); } catch (_) {}

    if (openaiPkg) {
      const OpenAI = openaiPkg.OpenAI || openaiPkg.default || openaiPkg;
      const client = new OpenAI({ apiKey: key });
      const res = await client.chat.completions.create({
        model, messages,
        max_tokens: 900,
        temperature: 0.85,
        presence_penalty: 0.5,
        frequency_penalty: 0.3
      });
      const text = res.choices?.[0]?.message?.content?.trim();
      if (text) { console.log(`✅ OpenAI (sdk) responded: ${text.length} chars`); return { text, provider: 'openai' }; }
    }

    // Fallback: raw HTTPS call (works without npm package)
    const result = await httpsPost('api.openai.com', '/v1/chat/completions',
      { Authorization: `Bearer ${key}` },
      { model, messages, max_tokens: 900, temperature: 0.85, presence_penalty: 0.5, frequency_penalty: 0.3 }
    );

    if (result.status !== 200) {
      console.error('❌ OpenAI HTTP error:', result.status, JSON.stringify(result.body));
      return null;
    }

    const text = result.body?.choices?.[0]?.message?.content?.trim();
    if (text) { console.log(`✅ OpenAI (https) responded: ${text.length} chars`); return { text, provider: 'openai' }; }
    return null;
  } catch (err) {
    console.error('❌ OpenAI error:', err.message);
    return null;
  }
}

async function callGemini(systemPrompt, userPrompt) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      systemInstruction: systemPrompt
    });
    const result = await model.generateContent(userPrompt);
    const text = result.response.text().trim();
    console.log(`✅ Gemini responded: ${text.length} chars`);
    return text ? { text, provider: 'gemini' } : null;
  } catch (err) {
    console.error('❌ Gemini error:', err.message);
    return null;
  }
}

async function callCoachLLM(systemPrompt, userPrompt, history = []) {
  return (
    (await callOpenAI(systemPrompt, userPrompt, history)) ||
    (await callGemini(systemPrompt, userPrompt)) ||
    null
  );
}

// Smart fallback that actually answers the question
function fallbackReply(msg) {
  const q = (msg || '').toLowerCase();
  if (/breakfast|morning meal/.test(q))
    return `**Breakfast ideas:**\n- Oats + banana + 2 boiled eggs (~420 kcal, 28g protein)\n- Greek yogurt + granola + berries (~350 kcal)\n- Whole wheat toast + peanut butter + milk (~400 kcal)\n\nAim for 25-30g protein at breakfast to stay full longer.`;
  if (/lunch/.test(q))
    return `**Lunch ideas:**\n- Grilled chicken + brown rice + salad (~520 kcal, 40g protein)\n- Tuna wrap + veggies (~450 kcal)\n- Dal + roti + sabzi (~480 kcal)\n\nKeep lunch your biggest meal of the day.`;
  if (/dinner/.test(q))
    return `**Dinner ideas:**\n- Salmon + sweet potato + broccoli (~500 kcal)\n- Paneer + roti + salad (~450 kcal)\n- Egg bhurji + 2 rotis (~380 kcal)\n\nKeep dinner lighter than lunch, eat 2-3 hrs before bed.`;
  if (/meal|eat|food|diet|nutrition/.test(q))
    return `**Daily meal plan:**\n\n🌅 **Breakfast** (7-8am): Oats + eggs + fruit (~420 kcal)\n☀️ **Lunch** (12-1pm): Chicken/dal + rice + salad (~550 kcal)\n🌙 **Dinner** (7-8pm): Fish/paneer + veggies + roti (~480 kcal)\n🍎 **Snacks**: Nuts, yogurt, fruit (~200 kcal)\n\n**Total: ~1650 kcal** — adjust based on your goal.`;
  if (/workout|exercise|gym|train/.test(q))
    return `**Full-body workout (40 min):**\n\n1. **Squats** — 4×12 (rest 60s)\n2. **Push-ups** — 3×15 (rest 45s)\n3. **Dumbbell rows** — 3×12 each (rest 60s)\n4. **Lunges** — 3×10 each leg (rest 45s)\n5. **Plank** — 3×45 sec (rest 30s)\n6. **Jumping jacks** — 3×30 (rest 30s)\n\nWarm up 5 min, cool down 5 min. 💪`;
  if (/lose weight|fat loss|slim|weight loss/.test(q))
    return `**Weight loss strategy:**\n\n- **Calorie deficit:** Eat 400-500 kcal less than your TDEE\n- **Protein:** 1.8g per kg bodyweight (preserves muscle)\n- **Cardio:** 30 min brisk walk daily + 2x HIIT/week\n- **Strength training:** 3x/week (builds metabolism)\n- **Water:** 3-4 litres/day\n- **Sleep:** 7-8 hours (controls hunger hormones)\n\nExpect 0.5-1 kg loss per week — sustainable pace.`;
  if (/muscle|bulk|gain weight/.test(q))
    return `**Muscle building strategy:**\n\n- **Calorie surplus:** Eat 300-400 kcal above TDEE\n- **Protein:** 2g per kg bodyweight daily\n- **Training:** Progressive overload — increase weight/reps weekly\n- **Compound lifts:** Squat, deadlift, bench press, rows\n- **Sleep:** 8 hours — muscle grows during recovery\n- **Consistency:** 4-5 training days/week minimum`;
  if (/motivat|consistent|lazy|tired/.test(q))
    return `Here's the truth: **motivation is temporary, discipline is permanent.**\n\nStart with just 10 minutes. Once you start, you'll keep going.\n\n- Track your progress — seeing numbers improve is addictive\n- Find a workout you actually enjoy\n- Set a specific time daily — make it a non-negotiable appointment\n- Remember why you started\n\nYou don't need to feel motivated. You just need to start. 💪`;
  if (/cardio|running|cycling/.test(q))
    return `**Best cardio for fat loss:**\n\n1. **HIIT** (20 min) — burns most calories, boosts metabolism 24hrs\n2. **Brisk walking** (45 min) — easy, sustainable, burns fat directly\n3. **Cycling** (30 min) — low impact, great for knees\n4. **Jump rope** (15 min) — high intensity, no equipment\n\nFor fat loss: 3-4x cardio/week + 3x strength training is the sweet spot.`;
  return `I'm your AI Fitness Coach! I can help with:\n\n- 🏋️ **Workout plans** — custom routines for your goal\n- 🥗 **Meal planning** — what to eat and when\n- ⚖️ **Weight management** — lose fat or build muscle\n- 💪 **Exercise guidance** — form, sets, reps\n- 📊 **Nutrition advice** — calories, macros, supplements\n\nWhat would you like help with?`;
}

// ── Route handlers ────────────────────────────────────────────────────────────

const chat = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    const rawMessage = (req.body.message || '').trim();
    const todayOverrides = req.body.today || {};
    const history = Array.isArray(req.body.history) ? req.body.history : [];

    const ctx = await buildContext(userId);
    if (!ctx.user) return res.status(404).json({ message: 'User not found' });

    const systemPrompt = buildSystemPrompt(ctx);

    const userPrompt = rawMessage
      ? `${rawMessage}\n\n[Context: calories today=${ctx.today.calories}, workout today=${ctx.today.workout}]`
      : `Give a warm, personalized greeting to ${ctx.user.name || 'the user'} and one specific tip based on their profile and recent activity.`;

    const llm = await callCoachLLM(systemPrompt, userPrompt, history);
    const reply = llm ? llm.text : fallbackReply(rawMessage);
    const source = llm ? llm.provider : 'fallback';

    res.json({
      reply, source,
      meta: {
        hasOpenAI: Boolean(process.env.OPENAI_API_KEY),
        hasGemini: Boolean(process.env.GEMINI_API_KEY)
      }
    });
  } catch (err) {
    console.error('Coach chat error:', err);
    res.status(500).json({ message: 'Coach unavailable. Try again.' });
  }
};

const suggest = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    const type = req.body.type || 'tip';
    const ctx = await buildContext(userId);
    if (!ctx.user) return res.status(404).json({ message: 'User not found' });

    const systemPrompt = buildSystemPrompt(ctx);
    const prompts = {
      workout: `Create a specific workout plan for today for ${ctx.user.name || 'this user'} whose goal is ${ctx.user?.fitnessGoal || 'fitness'}. Include exercise names, sets, reps, rest times, and total duration.`,
      meal: `Create a full day meal plan for ${ctx.user.name || 'this user'} whose goal is ${ctx.user?.fitnessGoal || 'fitness'}. Include breakfast, lunch, dinner, snacks with calories and macros.`,
      tip: `Give one highly specific, actionable fitness or nutrition tip for ${ctx.user.name || 'this user'} based on their goal: ${ctx.user?.fitnessGoal || 'general fitness'}.`
    };

    const llm = await callCoachLLM(systemPrompt, prompts[type] || prompts.tip, []);
    res.json({
      suggestion: llm ? llm.text : fallbackReply(type),
      type,
      source: llm ? llm.provider : 'fallback'
    });
  } catch (err) {
    console.error('Coach suggest error:', err);
    res.status(500).json({ message: 'Could not generate suggestion.' });
  }
};

module.exports = { chat, suggest };
