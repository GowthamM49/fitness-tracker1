import api from './api';

/**
 * @param {string} message - user message (empty = opening tip)
 * @param {object} [today] - optional overrides: steps, calories, sleep, workout
 * @param {Array}  [history] - prior messages [{role, content}]
 */
export async function sendCoachMessage(message, today = {}, history = []) {
  const { data } = await api.post('/coach/chat', {
    message: message || '',
    today: Object.keys(today).length ? today : undefined,
    history: history.length ? history : undefined
  });
  return data;
}

/**
 * @param {'workout'|'meal'|'tip'} type - type of suggestion
 */
export async function getAISuggestion(type = 'tip') {
  const { data } = await api.post('/coach/suggest', { type });
  return data;
}

export default { sendCoachMessage, getAISuggestion };
