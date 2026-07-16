(() => {
  function initializeSite() {
    const menuButton = document.querySelector(".menu-toggle");
    const navPanel = document.querySelector(".nav-panel");

    menuButton?.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute(
        "aria-label",
        window.translateUi(isOpen ? "Open navigation" : "Close navigation")
      );
      navPanel?.classList.toggle("is-open", !isOpen);
    });

    document.querySelectorAll(".nav-panel a").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton?.setAttribute("aria-expanded", "false");
        menuButton?.setAttribute(
          "aria-label",
          window.translateUi("Open navigation")
        );
        navPanel?.classList.remove("is-open");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !navPanel?.classList.contains("is-open")) {
        return;
      }
      menuButton?.setAttribute("aria-expanded", "false");
      menuButton?.setAttribute(
        "aria-label",
        window.translateUi("Open navigation")
      );
      navPanel.classList.remove("is-open");
      menuButton?.focus();
    });

    document.querySelectorAll(".accordion details").forEach((item) => {
      item.addEventListener("toggle", () => {
        if (!item.open) return;
        document.querySelectorAll(".accordion details").forEach((other) => {
          if (other !== item) other.open = false;
        });
      });
    });

    const requestDialog = document.getElementById("request-dialog");
    const requestForm = document.getElementById("request-form");
    document.querySelectorAll(".request-form-trigger").forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        requestDialog.showModal();
      });
    });
    document
      .querySelector(".request-dialog-close")
      ?.addEventListener("click", () => requestDialog.close());
    requestDialog?.addEventListener("click", (event) => {
      if (event.target === requestDialog) requestDialog.close();
    });
    requestForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(requestForm);
      const body = [
        `${window.translateUi("Name")}: ${data.get("name")}`,
        `Email: ${data.get("email")}`,
        `WhatsApp: ${data.get("whatsapp")}`,
        `${window.translateUi("Destination")}: ${data.get("destination")}`,
        `${window.translateUi("Travel dates")}: ${data.get("dates")}`,
        `${window.translateUi("Number of travelers")}: ${data.get("travelers")}`,
        "",
        data.get("message")
      ].join("\n");
      const subject = `${window.translateUi("Travel request")}: ${data.get(
        "destination"
      )}`;
      window.location.href =
        `mailto:imbondeirotravel@gmail.com?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;
    });

    const emailToggle = document.querySelector(".footer-email-toggle");
    const emailAddress = document.querySelector(".footer-email-address");
    emailToggle?.addEventListener("click", () => {
      const isExpanded = emailToggle.getAttribute("aria-expanded") === "true";
      emailToggle.setAttribute("aria-expanded", String(!isExpanded));
      emailAddress.hidden = isExpanded;
    });

    const phoneToggle = document.querySelector(".footer-phone-toggle");
    const phoneNumber = document.querySelector(".footer-phone-number");
    phoneToggle?.addEventListener("click", () => {
      const isExpanded = phoneToggle.getAttribute("aria-expanded") === "true";
      phoneToggle.setAttribute("aria-expanded", String(!isExpanded));
      phoneNumber.hidden = isExpanded;
    });

    const whatsappToggle = document.querySelector(".footer-whatsapp-toggle");
    const whatsappNumber = document.querySelector(".footer-whatsapp-number");
    whatsappToggle?.addEventListener("click", () => {
      const isExpanded =
        whatsappToggle.getAttribute("aria-expanded") === "true";
      whatsappToggle.setAttribute("aria-expanded", String(!isExpanded));
      whatsappNumber.hidden = isExpanded;
    });

    const heroScenes = Array.from(
      document.querySelectorAll("[data-hero-scene]")
    );
    const heroCaptions = Array.from(
      document.querySelectorAll("[data-hero-caption]")
    );
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!reducedMotion && heroScenes.length > 1) {
      let activeScene = 0;
      const playScene = (scene) => {
        if (scene instanceof HTMLVideoElement) {
          scene.play().catch(() => {});
        }
      };
      heroScenes.forEach(playScene);
      window.setInterval(() => {
        heroScenes[activeScene].classList.remove("is-active");
        heroCaptions[activeScene].classList.remove("is-active");
        activeScene = (activeScene + 1) % heroScenes.length;
        playScene(heroScenes[activeScene]);
        heroScenes[activeScene].classList.add("is-active");
        heroCaptions[activeScene].classList.add("is-active");
      }, 12000);
    }

    document.getElementById("travel-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const body = [
        `${window.translateUi("Name")}: ${data.get("name")}`,
        `Email: ${data.get("email")}`,
        `WhatsApp: ${data.get("whatsapp")}`,
        `${window.translateUi("Destination")}: ${data.get("destination")}`,
        `${window.translateUi("Travel dates")}: ${data.get("dates")}`,
        `${window.translateUi("Number of travelers")}: ${data.get("travelers")}`,
        "",
        data.get("message")
      ].join("\n");
      const subject = `${window.translateUi("Travel request")}: ${data.get(
        "destination"
      )}`;
      window.location.href =
        `mailto:imbondeirotravel@gmail.com?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;
    });

    const currencyConverter = document.querySelector("[data-currency-converter]");
    if (currencyConverter) {
      const toggleButton = currencyConverter.querySelector("[data-currency-toggle]");
      const panel = currencyConverter.querySelector(".currency-panel");
      const amountInput = currencyConverter.querySelector("[data-currency-amount]");
      const targetSelect = currencyConverter.querySelector("[data-currency-target]");
      const refreshButton = currencyConverter.querySelector("[data-currency-refresh]");
      const statusText = currencyConverter.querySelector("[data-currency-status]");
      const output = currencyConverter.querySelector("[data-currency-output]");
      const resultLabel = currencyConverter.querySelector("[data-currency-result-label]");
      const currencies = ["USD", "ZAR", "AOA"];
      let liveRates = null;
      let ratesRequested = false;

      const currencyNames = {
        USD: "US Dollars",
        ZAR: "South African Rand",
        AOA: "Angolan Kwanza"
      };

      const formatCurrency = (value, currency) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
          maximumFractionDigits: currency === "AOA" ? 0 : 2
        }).format(value);

      const updateCurrencyResults = () => {
        const amount = Number.parseFloat(amountInput.value) || 0;
        const currency = targetSelect.value;
        const rate = liveRates?.[currency];
        resultLabel.textContent = currencyNames[currency];
        output.textContent = rate
          ? formatCurrency(amount * rate, currency)
          : "Unavailable";
        output.setAttribute(
          "aria-label",
          `${currencyNames[currency]}: ${output.textContent}`
        );
      };

      const fetchCurrencyRates = async () => {
        ratesRequested = true;
        refreshButton.disabled = true;
        statusText.textContent = "Fetching live exchange rates...";
        try {
          const response = await fetch("https://open.er-api.com/v6/latest/EUR", {
            cache: "no-store"
          });
          if (!response.ok) throw new Error("Exchange rate service unavailable");
          const data = await response.json();
          liveRates = currencies.reduce((rates, currency) => {
            if (typeof data.rates?.[currency] === "number") {
              rates[currency] = data.rates[currency];
            }
            return rates;
          }, {});
          updateCurrencyResults();
          const updatedAt = data.time_last_update_utc
            ? new Date(data.time_last_update_utc)
            : new Date();
          statusText.textContent = `Live rates from EUR. Last updated: ${updatedAt.toLocaleString(
            "en-GB",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            }
          )}.`;
        } catch (error) {
          liveRates = null;
          updateCurrencyResults();
          statusText.textContent =
            "Live rates are temporarily unavailable. Please refresh or try again shortly.";
        } finally {
          refreshButton.disabled = false;
        }
      };

      amountInput.addEventListener("input", updateCurrencyResults);
      targetSelect.addEventListener("change", updateCurrencyResults);
      refreshButton.addEventListener("click", fetchCurrencyRates);
      toggleButton.addEventListener("click", () => {
        const willOpen = panel.hidden;
        panel.hidden = !willOpen;
        toggleButton.setAttribute("aria-expanded", String(willOpen));
        toggleButton.textContent = willOpen
          ? "Hide Currency Converter"
          : "Request Currency Converter";
        if (willOpen && !ratesRequested) fetchCurrencyRates();
      });
      updateCurrencyResults();
    }

    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }

  const translationScript = document.createElement("script");
  translationScript.src = "/translations.js";
  translationScript.addEventListener("load", initializeSite);
  document.head.appendChild(translationScript);
})();
