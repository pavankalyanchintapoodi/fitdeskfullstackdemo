import db, { initializeDatabase } from './database.js';
import bcrypt from 'bcryptjs';

const demoMembers = [
  {
    name: 'John Smith',
    email: 'john@example.com',
    phone: '555-0101',
    subscription_start: '2025-04-15',
    subscription_end: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subscription_type: 'Premium'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '555-0102',
    subscription_start: '2025-04-10',
    subscription_end: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subscription_type: 'Basic'
  },
  {
    name: 'Mike Davis',
    email: 'mike@example.com',
    phone: '555-0103',
    subscription_start: '2025-04-01',
    subscription_end: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subscription_type: 'VIP'
  },
  {
    name: 'Emma Wilson',
    email: 'emma@example.com',
    phone: '555-0104',
    subscription_start: '2025-03-20',
    subscription_end: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subscription_type: 'Personal Training'
  },
  {
    name: 'Alex Martinez',
    email: 'alex@example.com',
    phone: '555-0105',
    subscription_start: '2025-04-08',
    subscription_end: new Date(Date.now() + 0 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subscription_type: 'Basic'
  },
  {
    name: 'Lisa Anderson',
    email: 'lisa@example.com',
    phone: '555-0106',
    subscription_start: '2025-03-15',
    subscription_end: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subscription_type: 'Premium'
  },
  {
    name: 'David Brown',
    email: 'david@example.com',
    phone: '555-0107',
    subscription_start: '2025-03-01',
    subscription_end: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subscription_type: 'VIP'
  },
  {
    name: 'Jessica Taylor',
    email: 'jessica@example.com',
    phone: '555-0108',
    subscription_start: '2025-04-12',
    subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subscription_type: 'Basic'
  }
];

async function seedDatabase() {
  await initializeDatabase();

  db.serialize(async () => {
    // Delete existing data
    db.run('DELETE FROM notifications');
    db.run('DELETE FROM clients');
    db.run('DELETE FROM users', async (err) => {
      if (err) {
        console.error('Error clearing users:', err);
      } else {
        // Insert default test user
        const hashedPassword = await bcrypt.hash('password123', 10);
        db.run(
          'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
          ['owner@gym.com', hashedPassword, 'Gym Owner', 'owner'],
          async function(err) {
            if (err) {
              console.error('Error inserting user:', err);
              return;
            }

            const userId = this.lastID;
            console.log(`✅ Created test user: owner@gym.com (password: password123)`);

            // Insert demo members with user_id
            demoMembers.forEach(member => {
              const status = calculateStatus(member.subscription_end);

              db.run(
                `INSERT INTO clients (user_id, name, email, phone, subscription_start, subscription_end, subscription_type, status, notification_sent, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP)`,
                [
                  userId,
                  member.name,
                  member.email,
                  member.phone,
                  member.subscription_start,
                  member.subscription_end,
                  member.subscription_type,
                  status
                ],
                function(err) {
                  if (err) {
                    console.error('Error inserting member:', err);
                  } else {
                    console.log(`✅ Inserted: ${member.name}`);
                  }
                }
              );
            });

            console.log('✅ Seed data inserted successfully!');
          }
        );
      }
    });
  });
}

function calculateStatus(endDate) {
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'expired';
  if (diffDays <= 1) return 'expiring';
  return 'active';
}

seedDatabase().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});

