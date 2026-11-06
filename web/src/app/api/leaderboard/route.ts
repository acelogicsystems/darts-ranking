import { NextResponse } from "next/server";
import { getReport } from "@/lib/getReport";

 export  const dynamic = "force-dynamic";

export function GET() {
    const result = getReport();
    if (result.ok) return NextResponse.json(result.report);
    return NextResponse.json(
        { error: result.error, problems: result.problems },
        { status: result.status }
    );
}