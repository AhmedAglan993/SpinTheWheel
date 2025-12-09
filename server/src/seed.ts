import prisma from './db/prisma';
import { hashPassword } from './utils/password';

async function seed() {
    console.log('🌱 Seeding database...');

    try {
        // Create demo tenant
        const hashedPassword = await hashPassword('demo123');

        const demoTenant = await prisma.tenant.upsert({
            where: { email: 'demo@example.com' },
            update: {},
            create: {
                name: 'The Grand Eatery',
                ownerName: 'John Doe',
                email: 'demo@example.com',
                password: hashedPassword,
                status: 'Active',
                logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFdq24kBzGT70B2mU4hnGiMLSSS_7-bOVcC0XCUz7JUlscw6Znhe1JgRqeAmpApyE41WV-78xKOju3C0OGwpzvTfSEVT-DEZ6zuAoi4BnaUQuIRC_UYEyz0uyueOHe1HH5eKSTInthr7QJAOpbTWbt8iHATRu3bRk9N3N3wVXxX_7_LMqLO2aGdFfK3knW7ZUhUAfb0g9nCRQxIulNWBSduu57hQiclDYePyxhRc4eoN5wcfiEjE1cFo2uzaLFBMlPzzGw3Bz4Vso',
                primaryColor: '#2bbdee'
            }
        });

        console.log('✅ Created demo tenant:', demoTenant.email);

        // Create prizes
        const prizes = [
            { name: 'Free Appetizer', type: 'Food Item', description: 'Any appetizer up to $10 value' },
            { name: '15% Off Total', type: 'Discount', description: 'Valid on orders over $50' },
            { name: 'Free Drink', type: 'Food Item', description: 'Soft drink or iced tea' },
            { name: '$5 Voucher', type: 'Voucher', description: 'For next visit' },
            { name: 'Free Dessert', type: 'Food Item', description: 'Any dessert from our menu' },
            { name: '20% Off', type: 'Discount', description: 'On your next visit' }
        ];

        for (const prize of prizes) {
            await prisma.prize.upsert({
                where: {
                    tenantId_name: {
                        tenantId: demoTenant.id,
                        name: prize.name
                    }
                },
                update: {},
                create: {
                    tenantId: demoTenant.id,
                    ...prize,
                    status: 'Active'
                }
            });
        }

        console.log(`✅ Created ${prizes.length} prizes`);

        // Create sample users
        const users = [
            { name: 'Eleanor Pena', email: 'eleanor.p@example.com', avatar: 'https://ui-avatars.com/api/?name=Eleanor+Pena' },
            { name: 'John Smith', email: 'john.s@example.com', avatar: 'https://ui-avatars.com/api/?name=John+Smith' },
            { name: 'Sarah Johnson', email: 'sarah.j@example.com', avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson' }
        ];

        for (const user of users) {
            await prisma.user.upsert({
                where: {
                    tenantId_email: {
                        tenantId: demoTenant.id,
                        email: user.email
                    }
                },
                update: {},
                create: {
                    tenantId: demoTenant.id,
                    ...user,
                    plan: 'Basic',
                    status: 'Active'
                }
            });
        }

        console.log(`✅ Created ${users.length} sample users`);

        // Create spin configuration
        const existingConfig = await prisma.spinConfiguration.findUnique({
            where: { tenantId: demoTenant.id }
        });

        if (!existingConfig) {
            await prisma.spinConfiguration.create({
                data: {
                    tenantId: demoTenant.id,
                    wheelColors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'],
                    spinDuration: 5000,
                    soundEnabled: true,
                    showConfetti: true,
                    customMessage: 'Spin to win amazing prizes!'
                }
            });
            console.log('✅ Created spin configuration');
        } else {
            console.log('✅ Spin configuration already exists');
        }

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📝 Demo credentials:');
        console.log('   Email: demo@example.com');
        console.log('   Password: demo123');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seed();
