/* GitHub Pages-only private feedback inbox.
 * Sign-in uses Supabase Auth with a PUBLIC publishable key.
 * The JWT stays in JS memory and is sent only to the separate read-only
 * relay; that relay calls the original unchanged owner-gated reports API.
 * Never persists passwords, access tokens or user reports in browser storage.
 */
(() => {
  "use strict";
  const API = "https://xzxqfrvqdgkzwujbkdbk.supabase.co";
  const PUBLIC_KEY = "sb_publishable_1wHhSq2xo0XBwsKXO_64HQ_xyVY9xRN";
  const AUTH_URL = API + "/auth/v1/token?grant_type=password";
  const REPORT_URL = API + "/functions/v1/lumiose-atlas-owner-reports";
  const login = document.getElementById("ownerLogin");
  const loginPanel = document.getElementById("loginPanel");
  const reportsPanel = document.getElementById("reportsPanel");
  const loginButton = document.getElementById("signIn");
  const email = document.getElementById("ownerEmail");
  const password = document.getElementById("ownerPassword");
  const status = document.getElementById("ownerStatus");
  const reports = document.getElementById("reportList");
  const total = document.getElementById("reportTotal");
  const loadMore = document.getElementById("loadMore");
  const signOut = document.getElementById("signOut");
  if (!login||!loginPanel||!reportsPanel||!loginButton||!email||!password||
      !status||!reports||!total||!loadMore||!signOut)return;
  let accessToken = "";
  let offset = 0;

  function notice(message,kind="") {
    status.className = "owner-status" + (kind ? " " + kind : "");
    status.textContent = message;
  }
  function reportElement(record) {
    const article = document.createElement("article");
    article.className = "report-entry";
    const heading = document.createElement("div");
    heading.className = "report-heading";
    const title = document.createElement("h3");
    title.textContent = "Report #" + String(record.id ?? "");
    const category = document.createElement("span");
    category.className = "report-category";
    category.textContent = String(record.category ?? "");
    heading.append(title,category);

    const meta = document.createElement("div");
    meta.className = "report-meta";
    const date = document.createElement("span");
    const parsed = new Date(record.created_at);
    date.textContent = "Date: " + (Number.isNaN(parsed.getTime())
      ? "Unknown date" : parsed.toLocaleString("en-GB",{dateStyle:"medium",timeStyle:"short"}));
    const page = document.createElement("span");
    page.textContent = "Page: " + String(record.page ?? "");
    meta.append(date,page);

    const message = document.createElement("p");
    message.className = "report-message";
    message.textContent = String(record.details ?? "");
    article.append(heading,meta,message);
    return article;
  }
  async function loadReports(firstPage=false) {
    if (!accessToken || loadMore.disabled)return false;
    loadMore.disabled = true;
    notice("Loading saved feedback…");
    try {
      const nextOffset=firstPage ? 0 : offset;
      const response = await fetch(REPORT_URL+"?offset="+nextOffset, {
        method: "GET", mode:"cors", cache:"no-store",
        headers:{"Authorization":"Bearer "+accessToken}
      });
      const data=await response.json().catch(()=>null);
      if(response.status===401)throw new Error("Sign-in has expired. Please sign in again.");
      if(response.status===403)throw new Error("This account is not authorised as the Stream Bandit owner.");
      if(response.status!==200||!data||!Array.isArray(data.reports)){
        throw new Error("Could not load reports securely. Please try again.");
      }
      if(firstPage){reports.replaceChildren();offset=0;}
      for(const item of data.reports)reports.append(reportElement(item));
      offset+=data.reports.length;
      const numberOfReports=Number.isSafeInteger(data.total) ? data.total : null;
      total.textContent=numberOfReports===null
        ? offset+" report"+(offset===1?"":"s")+" loaded"
        : numberOfReports+" saved report"+(numberOfReports===1?"":"s");
      loadMore.hidden=data.reports.length<100||(numberOfReports!==null&&offset>=numberOfReports);
      if(firstPage&&data.reports.length===0){
        const empty=document.createElement("p");
        empty.className="report-empty";
        empty.textContent="No feedback reports are saved yet.";
        reports.append(empty);
      }
      notice("Reports loaded securely. Only you can view these using your owner sign-in.","success");
      return true;
    } catch(error) {
      notice(error instanceof Error ? error.message : "Could not load reports.","error");
      return false;
    } finally {
      loadMore.disabled=false;
    }
  }

  login.addEventListener("submit",async event=>{
    event.preventDefault();
    if(loginButton.disabled)return;
    const emailText=email.value.trim(),secret=password.value;
    if(!emailText||!secret){notice("Enter your owner email and password.","error");return;}
    loginButton.disabled=true;
    notice("Signing in securely…");
    try {
      const response=await fetch(AUTH_URL, {
        method:"POST",mode:"cors",cache:"no-store",
        headers:{"Content-Type":"application/json","apikey":PUBLIC_KEY},
        body:JSON.stringify({email:emailText,password:secret})
      });
      const data=await response.json().catch(()=>null);
      if(response.status!==200||typeof data?.access_token!=="string"||!data.access_token){
        throw new Error("Could not sign in. Check the Stream Bandit owner email and password.");
      }
      accessToken=data.access_token;
      const loaded=await loadReports(true);
      if(!loaded){accessToken="";return;}
      password.value="";
      loginPanel.hidden=true;
      reportsPanel.hidden=false;
    }catch(error){
      accessToken="";
      notice(error instanceof Error ? error.message : "Sign-in failed.","error");
    }finally{
      password.value="";
      loginButton.disabled=false;
    }
  });
  loadMore.addEventListener("click",()=>{void loadReports();});
  signOut.addEventListener("click",()=>{
    accessToken="";
    offset=0;
    reports.replaceChildren();
    loginPanel.hidden=false;
    reportsPanel.hidden=true;
    loadMore.hidden=true;
    email.value="";
    password.value="";
    notice("Signed out. No reports or tokens were stored on this device.");
  });
})();
