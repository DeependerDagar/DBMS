const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/user');
const Movie = require('../models/movie');
const Showtime = require('../models/Showtime');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

/**
 * Generates standard 40-seat layout for Airia Mall screens:
 * - Row A: VIP Recliner (₹450)
 * - Rows B & C: Prime Club (₹280)
 * - Rows D & E: Classic Pavilion (₹180)
 */
const generateSeats = () => {
  const seats = [];
  const rows = [
    { row: 'A', tier: 'VIP Recliner', price: 450, count: 8 },
    { row: 'B', tier: 'Prime Club', price: 280, count: 8 },
    { row: 'C', tier: 'Prime Club', price: 280, count: 8 },
    { row: 'D', tier: 'Classic Pavilion', price: 180, count: 8 },
    { row: 'E', tier: 'Classic Pavilion', price: 180, count: 8 }
  ];

  rows.forEach((r) => {
    for (let num = 1; num <= r.count; num++) {
      seats.push({
        seatId: `${r.row}${num}`,
        row: r.row,
        number: num,
        tier: r.tier,
        price: r.price,
        isBooked: false,
        bookedBy: null
      });
    }
  });

  return seats;
};

// 12-hour format string ko Date object me convert karne ke liye helper function
const parseShowDateTime = (dateStr, timeStr) => {
  const [timePart, modifier] = timeStr.split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  const dateObj = new Date(dateStr);
  dateObj.setHours(hours, minutes, 0, 0);
  return dateObj;
};

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Purging existing database collections & dropping old indexes...');
    
    // Purane indexes ki wajah se duplicate error na aaye isliye collection drop try karte hain
    try {
      await Showtime.collection.drop();
    } catch (err) {
      // Agar collection pehle se exist nahi karti toh safely ignore karega
    }

    await User.deleteMany();
    await Movie.deleteMany();
    await Booking.deleteMany();
    await Payment.deleteMany();

    console.log('[Seeder] Creating designated administrator account...');
    const adminUser = await User.create({
      name: 'Airia Mall Manager',
      email: (process.env.ADMIN_EMAIL || 'admin@cineplex.com').toLowerCase(),
      password: process.env.ADMIN_PASSWORD || 'AdminCineplex@2026',
      role: 'admin'
    });

    console.log('[Seeder] Seeding initial movie catalog...');
    const movies = await Movie.insertMany([
      {
        title: 'Interstellar',
        overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.',
        posterPath: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        backdropPath: 'https://image.tmdb.org/t/p/original/rAiYTsqhk0KN9v49iXgAqiR6eQO.jpg',
        genres: ['Science Fiction', 'Drama', 'Adventure'],
        runtime: 169,
        rating: 8.7,
        language: 'English',
        releaseDate: '2014-11-05',
        source: 'admin'
      },
      {
        title: 'Oppenheimer',
        overview: 'The story of J. Robert Oppenheimer role in the development of the atomic bomb during World War II.',
        posterPath: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        backdropPath: 'https://image.tmdb.org/t/p/original/fm6K9vY9wgBmXx7pL5wEOGw7x4R.jpg',
        genres: ['Drama', 'History'],
        runtime: 180,
        rating: 8.9,
        language: 'English',
        releaseDate: '2023-07-21',
        source: 'admin'
      },
      {
        title: 'The Dark Knight',
        overview: 'Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent.',
        posterPath: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        backdropPath: 'https://image.tmdb.org/t/p/original/dqK9Hag1054tghRQSqLSfrkvQnA.jpg',
        genres: ['Action', 'Crime', 'Drama'],
        runtime: 152,
        rating: 9.0,
        language: 'English',
        releaseDate: '2008-07-18',
        source: 'admin'
      },
      {
        title: 'Inception',
        overview: 'Cobb steals information from targets by entering their dreams through experimental military technology.',
        posterPath: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
        backdropPath: 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
        genres: ['Action', 'Science Fiction', 'Adventure'],
        runtime: 148,
        rating: 8.8,
        language: 'English',
        releaseDate: '2010-07-16',
        source: 'admin'
      }
    ]);

    console.log('[Seeder] Creating independent showtimes with seat layouts...');
    const today = new Date().toISOString().split('T')[0];
    const timeslots = ['11:00 AM', '02:30 PM', '06:00 PM', '09:30 PM'];

    const screens = [
      'Airia Mall Screen 1',
      'Airia Mall Screen 2',
      'Airia Mall Screen 3',
      'Airia Mall Screen 4'
    ];

    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      const screenName = screens[i] || `Airia Mall Screen ${i + 1}`;

      for (const time of timeslots) {
        const calculatedStartTime = parseShowDateTime(today, time);

        await Showtime.create({
          movie: movie._id,
          screen: screenName,
          startTime: calculatedStartTime,
          date: today,
          time: time,
          seats: generateSeats()
        });
      }
    }

    console.log('\n=========================================');
    console.log(' SEEDING COMPLETE');
    console.log(` Admin Email:    ${adminUser.email}`);
    console.log(` Admin Password: ${process.env.ADMIN_PASSWORD || 'AdminCineplex@2026'}`);
    console.log(` Seeded Movies:  ${movies.length}`);
    console.log(` Total Showtimes Created: ${movies.length * timeslots.length}`);
    console.log(` Date:           ${today}`);
    console.log('=========================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] ${error.message}`);
    process.exit(1);
  }
};

seedData();