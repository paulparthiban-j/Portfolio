import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_token");
    const isValid = adminToken?.value === (process.env.ADMIN_TOKEN || "super-secret-admin");

    if (!isValid) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
        return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "File must be under 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(process.cwd(), "public", "resume.pdf");

    await writeFile(filePath, buffer);

    return NextResponse.json({ success: true, message: "Resume updated successfully" });
}
