type LogEntry = {
  id: string;
  event_type: string;
  metadata: any;
  created_at: string;
};

export const calculatePrimeTime = (logs: LogEntry[]) => {
  if (!logs || !Array.isArray(logs) || logs.length === 0) {
    return {
      type: 'empty',
      bucket: null,
      percentage: 0,
      title: 'Data Belum Cukup',
      message: 'Selesaikan tugas atau sesi fokus pertamamu minggu ini untuk membuka wawasan belajarmu.'
    };
  }

  const filtered = logs.filter(l => l?.event_type === 'task_completed' || l?.event_type === 'focus_completed');
  if (filtered.length === 0) {
    return {
      type: 'empty',
      bucket: null,
      percentage: 0,
      title: 'Data Belum Cukup',
      message: 'Selesaikan tugas atau sesi fokus pertamamu minggu ini untuk membuka wawasan belajarmu.'
    };
  }

  const buckets = {
    Morning: 0,   // 05:00 - 11:59
    Afternoon: 0, // 12:00 - 14:59
    Evening: 0,   // 15:00 - 18:59
    Night: 0      // 19:00 - 04:59
  };

  filtered.forEach(log => {
    try {
      if (!log || !log.created_at) return;
      
      const date = new Date(log.created_at);
      if (isNaN(date.getTime())) return; // Skip invalid or malformed dates
      
      const hour = date.getHours();
      if (hour >= 5 && hour < 12) buckets.Morning++;
      else if (hour >= 12 && hour < 15) buckets.Afternoon++;
      else if (hour >= 15 && hour < 19) buckets.Evening++;
      else buckets.Night++;
    } catch (e) {
      // Ignore malformed logs silently
    }
  });

  const total = buckets.Morning + buckets.Afternoon + buckets.Evening + buckets.Night;
  if (total === 0) {
    return {
      type: 'empty',
      bucket: null,
      percentage: 0,
      title: 'Data Belum Cukup',
      message: 'Selesaikan tugas atau sesi fokus pertamamu minggu ini untuk membuka wawasan belajarmu.'
    };
  }

  let highestBucket = 'Morning';
  let highestCount = buckets.Morning;

  for (const [bucket, count] of Object.entries(buckets)) {
    if (count > highestCount) {
      highestCount = count;
      highestBucket = bucket;
    }
  }

  const percentage = Math.round((highestCount / total) * 100);
  
  let title = "";
  let message = "";
  if (highestBucket === 'Morning') {
    title = "Kamu adalah 'Early Bird'!";
    message = `${percentage}% tugasmu selesai di pagi hari.`;
  } else if (highestBucket === 'Afternoon') {
    title = "Kamu adalah 'Day Walker'!";
    message = `${percentage}% tugasmu selesai di siang hari.`;
  } else if (highestBucket === 'Evening') {
    title = "Kamu adalah 'Sunset Rider'!";
    message = `${percentage}% tugasmu selesai di sore hari.`;
  } else {
    title = "Kamu adalah 'Burung Hantu'!";
    message = `${percentage}% tugasmu selesai di atas jam 8 malam.`;
  }

  return {
    type: 'success',
    bucket: highestBucket,
    percentage,
    title,
    message
  };
};

export const calculateFocusEfficiency = (logs: LogEntry[]) => {
  if (!logs || !Array.isArray(logs) || logs.length === 0) {
    return {
      type: 'empty',
      percentage: 0,
      title: 'Data Belum Cukup',
      message: 'Belum ada sesi fokus yang diselesaikan.'
    };
  }

  const focusLogs = logs.filter(l => l?.event_type === 'focus_completed');
  
  if (focusLogs.length === 0) {
    return {
      type: 'empty',
      percentage: 0,
      title: 'Data Belum Cukup',
      message: 'Belum ada sesi fokus yang diselesaikan.'
    };
  }

  let totalEfficiency = 0;

  focusLogs.forEach(log => {
    const metadata = log.metadata || {};
    const pauseCount = typeof metadata.pause_count === 'number' ? metadata.pause_count : 0;
    const efficiency = Math.max(0, 100 - (15 * pauseCount));
    totalEfficiency += efficiency;
  });

  const avgEfficiency = Math.round(totalEfficiency / focusLogs.length);

  let title = "";
  if (avgEfficiency >= 80) {
    title = "Fokus setajam laser!";
  } else if (avgEfficiency >= 60) {
    title = "Fokus yang bagus.";
  } else {
    title = "Terlalu banyak distraksi?";
  }

  return {
    type: 'success',
    percentage: avgEfficiency,
    title,
    message: `Rata-rata efisiensi fokusmu adalah ${avgEfficiency}%.`
  };
};
