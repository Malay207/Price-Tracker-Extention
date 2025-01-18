const updateInterval = 2 * 24 * 60 * 60 * 1000;

const updateScrapData = async () => {
  console.log("hello1");
  chrome.storage.local.get("prictracker_userid", async (result) => {
    if (result.prictracker_userid) {
      console.log("hello6");
      try {
        const response = await fetch(`https://chromeextention-backend-1.onrender.com/scrapp-data/update-scrap-data/${result.prictracker_userid.user_id}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          },
          // cache: 'no-cache', // Disable caching
          body: null, // No request body needed for GET requests
        });
        const data = await response.json();
        console.log("Scrap data updated successfully:", data);
      } catch (error) {
        console.error("Error updating scrap data:", error);
      }
    } else {
      console.error("User ID not found in storage.");
    }
  });
};
function checkAndUpdate() {
  // 5 minutes in milliseconds
  chrome.storage.local.get("lastUpdate_pricetracker", (result) => {
    const lastUpdate_pricetracker = result.lastUpdate_pricetracker || 0;
    const now = Date.now();

    if (now - lastUpdate_pricetracker >= updateInterval) {
      updateScrapData();
    } else {
      console.log("24 hours have not yet passed since the last update.");
    }
  });
}
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ lastUpdate_pricetracker: Date.now() }, () => {
    console.log("Extension installed, time set in storage.");
  });

  // Set an alarm for periodic updates every 24 hours
  chrome.alarms.create("periodicUpdate_pricetracker", { periodInMinutes: 1440 });
});

chrome.runtime.onStartup.addListener(() => {
  console.log("Browser started, checking if update is needed...");
  checkAndUpdate();
});

// Periodic updates using the alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "periodicUpdate_pricetracker") {
    console.log("check2");
    checkAndUpdate();
  }
});
