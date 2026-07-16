import {NextResponse} from "next/server";
const allowed=new Set(["AOA","EUR","USD","ZAR","GBP"]);
export async function GET(request){
 const {searchParams}=new URL(request.url);const from=(searchParams.get("from")||"EUR").toUpperCase();const to=(searchParams.get("to")||"AOA").toUpperCase();const amount=Number(searchParams.get("amount")||1);
 if(!allowed.has(from)||!allowed.has(to)||!Number.isFinite(amount)||amount<=0)return NextResponse.json({error:"Invalid conversion request"},{status:400});
 try{const response=await fetch(`https://open.er-api.com/v6/latest/${from}`,{next:{revalidate:3600}});if(!response.ok)throw new Error("rate service failed");const data=await response.json();const rate=data?.rates?.[to];if(!Number.isFinite(rate))throw new Error("rate unavailable");return NextResponse.json({from,to,amount,rate,result:amount*rate,updated:data.time_last_update_utc||null});}catch{return NextResponse.json({error:"Live exchange rate unavailable"},{status:503})}
}
