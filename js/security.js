import { supabase } from './supabaseClient.js';

const loader = Swal.fire({
  title: 'Loading...',
  html: 'Please wait while we get your content.',
  allowOutsideClick: false,
  didOpen: () => {
    Swal.showLoading();
  }
});

const LOGIN_PAGE = 'login.html';
const SUPPORT_PAGE = 'contact.html';
const UPGRADE_PAGE = 'subscription.html';

const SERVICE_RULES = {
  'reminder.html':   ['premium'],
  'challenge.html':  ['standard','trial','premium'],
  'pack.html':       ['standard','premium'],
  'capability.html': ['standard','trial','premium'],
  'scope.html':      ['premium'],
  'nsfas.html':      ['premium'],
  'university.html': ['premium'],
  'options.html':    ['standard','premium'],
  'community.html':  ['free','standard','trial','premium'],
  'instant-reply':   ['premium'],
  'read.html':       ['free','standard','trial','premium'],
  'rewards.html':    ['premium'],
};

function getGreeting(name) {
  const hour = new Date().getHours();
  let interval;

  if (hour < 12) interval = 'morning';
  else if (hour < 18) interval = 'afternoon';
  else interval = 'evening';

  const lastInterval = localStorage.getItem('greetingInterval');

  if (interval !== lastInterval) {
    localStorage.setItem('greetingInterval', interval);
    return `Good ${interval}, ${name}!`;
  }

  return null; // no greeting
}

(async function initUserCheck() {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      Swal.close(); 
      return Swal.fire({
        icon: 'warning',
        title: 'Not logged in',
        text: 'Please login to continue',
        confirmButtonText: 'Go to login'
      }).then(() => window.location.href = LOGIN_PAGE);
    }

    const userId = session.user.id;

    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('role, email, is_active')
      .eq('user_id', userId)
      .single();

    if (accountError || !account) {
      await supabase.auth.signOut();
      Swal.close(); 
      return window.location.href = LOGIN_PAGE;
    }

    if (!account.is_active) {
      Swal.fire({
        icon: 'warning',
        title: 'Account restricted',
        text: 'Your account is inactive, banned, or pending deletion. Contact support.',
        showCancelButton: true,           // allows the user to dismiss
        confirmButtonText: 'Go to support',
        cancelButtonText: 'Back to login'
      }).then((result) => {
        if (result.isConfirmed) {
          // User clicked "Go to support"
          window.location.href = SUPPORT_PAGE;
        } else {
          // User dismissed / clicked cancel
          window.location.href = LOGIN_PAGE;
        }
      });
    }

    const { data: subscription } = await supabase
      .from('subscription')
      .select('current_plan, subscription_status')
      .eq('user_id', userId)
      .single();

    const plan = subscription?.current_plan?.toLowerCase() || account.role.toLowerCase() || 'free';
    let status = subscription?.subscription_status?.toLowerCase() || 'free';

    // ✅ Treat paused subscriptions as free
    if (status === 'paused') {
      status = 'free';
    }

    // ✅ Effective plan check
    const effectivePlan = status === 'free' ? 'free' : plan;

    const currentPage = window.location.pathname.split("/").pop().toLowerCase();

    if (SERVICE_RULES[currentPage] && !SERVICE_RULES[currentPage].includes(effectivePlan)) {
      Swal.close(); 
      return Swal.fire({
        icon: 'info',
        title: 'Upgrade required',
        text: 'Your current plan does not grant access to this page.',
        confirmButtonText: 'Upgrade Now'
      }).then(() => window.location.href = UPGRADE_PAGE);
    }

    if (status !== 'active' && status !== 'free') {
      Swal.close(); 
      return Swal.fire({
        icon: 'info',
        title: 'Subscription issue',
        text: 'Your subscription is inactive or overdue. Upgrade to continue full access.',
        confirmButtonText: 'Upgrade'
      }).then(() => window.location.href = UPGRADE_PAGE);
    }

// ✅ Universal lock for all elements with data-service (links, buttons, divs)
document.querySelectorAll("[data-service]").forEach(el => {
  const service = el.dataset.service.toLowerCase();
  const allowed = SERVICE_RULES[service];

  if (allowed && !allowed.includes(effectivePlan)) {
    // 🔒 Visual lock styling
    el.classList.add("opacity-50", "cursor-not-allowed", "relative", "select-none", "locked-item");

    // 🔒 Add lock icon if not already there
    if (!el.querySelector(".fa-lock")) {
      const lockIcon = document.createElement("i");
      lockIcon.className = "fa-solid fa-lock text-sm ml-2 text-gray-600";
      el.appendChild(lockIcon);
    }

    // 🔒 Add transparent overlay to block clicks inside
    if (!el.querySelector(".lock-overlay")) {
      const overlay = document.createElement("div");
      overlay.className = "lock-overlay absolute inset-0 z-10";
      overlay.style.background = "transparent";
      el.appendChild(overlay);
    }

    // 🚫 Intercept all clicks and touches
    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      // ✨ Shake animation
      el.classList.add("shake");
      setTimeout(() => el.classList.remove("shake"), 500);

      // ⚠️ Show SweetAlert upgrade prompt
      Swal.fire({
        icon: 'info',
        title: 'Locked Feature',
        text: 'Upgrade your plan to unlock this feature.',
        confirmButtonText: 'Upgrade Now',
        showCancelButton: true,
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = UPGRADE_PAGE;
        }
      });
    }, true);
  }
});

// 🎨 Inject shake animation style (only once)
if (!document.getElementById('lock-style')) {
  const style = document.createElement('style');
  style.id = 'lock-style';
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-5px); }
      40%, 80% { transform: translateX(5px); }
    }
    .shake {
      animation: shake 0.4s ease;
    }
  `;
  document.head.appendChild(style);
}

    Swal.close(); 

    // ✅ Only show greeting if interval changed
    const name = account.email.split('@')[0];
    const message = getGreeting(name);
    if (message) {
      Swal.fire({
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 2500
      });
    }

  } catch (err) {
    Swal.close(); 
    console.error(err);
    Swal.fire({ icon: 'error', title: 'Unexpected error', text: 'Something went wrong.' });
  }
})();
