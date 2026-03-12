import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "admin@asencx.com";
    const password = "Admin12345*"; // cámbialo luego
    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            name: "Admin",      // ✅ OBLIGATORIO (tu User lo requiere)
            email,
            passwordHash,
            role: Role.SUPER_ADMIN
        },
    });

    console.log("Seed OK. Admin:", email, "Pass:", password);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
