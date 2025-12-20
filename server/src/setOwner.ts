import prisma from './db/prisma';

async function setOwner() {
    const email = 'ahmedaglan993@gmail.com';

    try {
        const tenant = await prisma.tenant.update({
            where: { email },
            data: { isOwner: true }
        });

        console.log('✅ Successfully set as platform owner:');
        console.log(`   Name: ${tenant.name}`);
        console.log(`   Email: ${tenant.email}`);
        console.log(`   isOwner: ${tenant.isOwner}`);
    } catch (error) {
        console.error('❌ Failed to update tenant:', error);
    } finally {
        await prisma.$disconnect();
    }
}

setOwner();
