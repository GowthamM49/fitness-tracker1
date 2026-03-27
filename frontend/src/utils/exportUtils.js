import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

// Export data to PDF
export const exportToPDF = (data, filename, title) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(title, 20, 20);
  
  // Add generation date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
  
  let yPosition = 50;
  
  // Add data based on type
  if (Array.isArray(data)) {
    // Table format for array data
    data.forEach((item, index) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.text(`Entry ${index + 1}:`, 20, yPosition);
      yPosition += 10;
      
      Object.entries(item).forEach(([key, value]) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFontSize(10);
        doc.text(`${key}: ${value}`, 30, yPosition);
        yPosition += 7;
      });
      yPosition += 10;
    });
  } else if (typeof data === 'object') {
    // Object format
    Object.entries(data).forEach(([key, value]) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(12);
      doc.text(`${key}:`, 20, yPosition);
      yPosition += 10;
      
      if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
          }
          doc.setFontSize(10);
          doc.text(`  ${subKey}: ${subValue}`, 30, yPosition);
          yPosition += 7;
        });
      } else {
        doc.setFontSize(10);
        doc.text(`  ${value}`, 30, yPosition);
        yPosition += 7;
      }
      yPosition += 5;
    });
  }
  
  // Save the PDF
  doc.save(`${filename}.pdf`);
};

// Export data to Excel
export const exportToExcel = (data, filename, sheetName = 'Report') => {
  let worksheet;
  
  if (Array.isArray(data)) {
    // Array of objects - create worksheet directly
    worksheet = XLSX.utils.json_to_sheet(data);
  } else if (typeof data === 'object' && data.statistics) {
    // Report data with statistics
    const flatData = [];
    
    // Add statistics as first row
    Object.entries(data.statistics).forEach(([key, value]) => {
      flatData.push({
        Metric: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        Value: value
      });
    });
    
    // Add report metadata
    flatData.push({ Metric: 'Report Type', Value: data.reportType });
    flatData.push({ Metric: 'Generated At', Value: new Date(data.generatedAt).toLocaleString() });
    
    worksheet = XLSX.utils.json_to_sheet(flatData);
  } else {
    // Single object - convert to array
    const flatData = Object.entries(data).map(([key, value]) => ({
      Property: key,
      Value: value
    }));
    worksheet = XLSX.utils.json_to_sheet(flatData);
  }
  
  // Create workbook and add worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Save the Excel file
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// Export fitness progress report
export const exportFitnessProgressReport = (progressData, userInfo) => {
  const filename = `fitness-progress-report-${new Date().toISOString().split('T')[0]}`;
  
  const reportData = {
    'User Information': {
      Name: userInfo.name || 'N/A',
      Email: userInfo.email || 'N/A',
      Age: userInfo.age || 'N/A',
      Gender: userInfo.gender || 'N/A',
      Height: userInfo.height || 'N/A',
      Weight: userInfo.weight || 'N/A',
      FitnessGoal: userInfo.fitnessGoal || 'N/A'
    },
    'Progress Summary': {
      'Total Entries': progressData.length,
      'Date Range': progressData.length > 0 ? 
        `${progressData[0].date} to ${progressData[progressData.length - 1].date}` : 'N/A',
      'Weight Change': progressData.length > 1 ? 
        `${(progressData[0].weight - progressData[progressData.length - 1].weight).toFixed(2)} kg` : 'N/A',
      'Average BMI': progressData.length > 0 ? 
        (progressData.reduce((sum, p) => sum + (p.bmi || 0), 0) / progressData.length).toFixed(2) : 'N/A'
    },
    'Detailed Progress': progressData.map((entry, index) => ({
      'Entry #': index + 1,
      'Date': entry.date,
      'Weight (kg)': entry.weight,
      'BMI': entry.bmi,
      'Notes': entry.notes || 'N/A'
    }))
  };
  
  return reportData;
};

// Export workout statistics report
export const exportWorkoutStatisticsReport = (workoutData, stats) => {
  const filename = `workout-statistics-report-${new Date().toISOString().split('T')[0]}`;
  
  const reportData = {
    'Workout Statistics': stats,
    'Workout Details': workoutData.map((workout, index) => ({
      'Workout #': index + 1,
      'Name': workout.name,
      'Date': workout.date,
      'Duration (min)': workout.duration,
      'Exercises': workout.exercises ? workout.exercises.length : 0,
      'Notes': workout.notes || 'N/A'
    }))
  };
  
  return reportData;
};

// Export nutrition report
export const exportNutritionReport = (nutritionData, stats) => {
  const filename = `nutrition-report-${new Date().toISOString().split('T')[0]}`;
  
  const reportData = {
    'Nutrition Statistics': stats,
    'Meal Details': nutritionData.map((meal, index) => ({
      'Meal #': index + 1,
      'Name': meal.name,
      'Date': meal.date,
      'Calories': meal.calories,
      'Protein (g)': meal.protein,
      'Carbs (g)': meal.carbs,
      'Fat (g)': meal.fat,
      'Meal Type': meal.mealType || 'N/A'
    }))
  };
  
  return reportData;
};

// Export community participation report
export const exportCommunityReport = (communityData, stats) => {
  const filename = `community-participation-report-${new Date().toISOString().split('T')[0]}`;
  
  const reportData = {
    'Community Statistics': stats,
    'Challenge Details': communityData.map((challenge, index) => ({
      'Challenge #': index + 1,
      'Title': challenge.title,
      'Description': challenge.description,
      'Participants': challenge.participants ? challenge.participants.length : 0,
      'Status': challenge.status,
      'Start Date': challenge.startDate,
      'End Date': challenge.endDate
    }))
  };
  
  return reportData;
};

// Export analytics dashboard data
export const exportAnalyticsDashboard = (analyticsData, userInfo) => {
  const filename = `analytics-dashboard-${new Date().toISOString().split('T')[0]}`;
  
  const reportData = {
    'User Information': userInfo,
    'Analytics Summary': {
      'Weight Progress Entries': analyticsData.weightProgress.length,
      'Workout Statistics': analyticsData.workoutStats.length,
      'Nutrition Data Points': analyticsData.nutritionData.length,
      'Fitness Score Entries': analyticsData.fitnessScore.length,
      'Report Generated': new Date().toLocaleString()
    },
    'Weight Progress': analyticsData.weightProgress,
    'Workout Statistics': analyticsData.workoutStats,
    'Nutrition Data': analyticsData.nutritionData,
    'Fitness Score History': analyticsData.fitnessScore
  };
  
  return reportData;
};

// Utility function to format data for export
export const formatDataForExport = (data, type) => {
  switch (type) {
    case 'progress':
      return exportFitnessProgressReport(data.progress, data.user);
    case 'workouts':
      return exportWorkoutStatisticsReport(data.workouts, data.statistics);
    case 'nutrition':
      return exportNutritionReport(data.meals, data.statistics);
    case 'community':
      return exportCommunityReport(data.challenges, data.statistics);
    case 'analytics':
      return exportAnalyticsDashboard(data.analytics, data.user);
    default:
      return data;
  }
};

export default {
  exportToPDF,
  exportToExcel,
  exportFitnessProgressReport,
  exportWorkoutStatisticsReport,
  exportNutritionReport,
  exportCommunityReport,
  exportAnalyticsDashboard,
  formatDataForExport
};
