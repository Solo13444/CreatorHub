(() => {
  "use strict";

  const creators = window.creators;
  const number = new Intl.NumberFormat("ru-RU");
  const byId = id => document.getElementById(id);

  function initCatalog() {
    const form = byId("filter-form");
    const { q, platform, topic, audience, sort } = form.elements;
    const grid = byId("creator-grid");
    const ranges = { micro: [0, 10000], small: [10000, 100000], medium: [100000, 500000], large: [500000, Infinity] };
    const badgeIs = badge => (a, b) => Number(b.badge === badge) - Number(a.badge === badge);
    const sorters = {
      popular: (a, b) => badgeIs("Популярный")(a, b) || b.followers - a.followers,
      new: badgeIs("Новый автор"),
      low: (a, b) => a.followers - b.followers,
      high: (a, b) => b.followers - a.followers
    };
    const initial = new URLSearchParams(location.search);
    for (const [select, values] of [[platform, creators.flatMap(c => c.platforms)], [topic, creators.map(c => c.topic)]]) {
      [...new Set(values)].sort((a, b) => a.localeCompare(b, "ru")).forEach(value => select.add(new Option(value, value)));
    }
    q.value = initial.get("q") || "";
    for (const select of [platform, topic, audience, sort]) {
      const requested = initial.get(select.name)?.toLowerCase();
      const match = Array.from(select.options).find(option => option.value.toLowerCase() === requested);
      if (match) select.value = match.value;
    }

    function render() {
      const search = q.value.trim().toLocaleLowerCase("ru");
      const [min, max] = ranges[audience.value] || [0, Infinity];
      const matches = creators.filter(c =>
        (c.name + " " + c.handle).toLocaleLowerCase("ru").includes(search) &&
        (!platform.value || c.platforms.includes(platform.value)) &&
        (!topic.value || c.topic === topic.value) &&
        c.followers >= min && c.followers < max
      ).sort(sorters[sort.value]);
      grid.innerHTML = matches.map(window.creatorCard).join("");
      Array.from(grid.children).forEach((card, index) => card.style.setProperty("--card-delay", Math.min(index, 5) * 27 + "ms"));
      byId("creator-count").textContent = "Найдено: " + matches.length;
      byId("empty-results").hidden = matches.length > 0;
    }

    function update() {
      const url = new URL(location.href);
      for (const field of [q, platform, topic, audience, sort]) {
        if (!field.value || field === sort && field.value === "popular") url.searchParams.delete(field.name);
        else url.searchParams.set(field.name, field.value);
      }
      // Some browsers disallow history updates with a file:// origin.
      try { history.replaceState(null, "", url); } catch {}
      render();
    }
    form.addEventListener("input", event => { if (event.target === q) update(); });
    form.addEventListener("change", event => { if (event.target !== q) update(); });
    form.addEventListener("submit", event => { event.preventDefault(); update(); });
    form.addEventListener("reset", event => {
      event.preventDefault();
      q.value = "";
      for (const select of [platform, topic, audience, sort]) select.selectedIndex = 0;
      update();
    });
    byId("clear-results").addEventListener("click", () => {
      form.reset();
      q.focus();
    });
    render();
  }

  function initProfile() {
    const id = new URLSearchParams(location.search).get("id");
    const creator = id ? creators.find(c => c.id === id) : creators[0];
    if (!creator) {
      byId("profile-content").remove();
      byId("unknown-profile").hidden = false;
      byId("profile-crumb").textContent = "Автор не найден";
      document.title = "Автор не найден — CreatorHub";
      return;
    }
    byId("unknown-profile").remove();
    document.title = creator.name + " — CreatorHub";
    byId("profile-crumb").textContent = creator.name;
    byId("profile-name").textContent = creator.name;
    byId("profile-image").src = creator.image;
    byId("profile-image").alt = "Портрет автора — " + creator.name;
    byId("profile-topic").textContent = [creator.handle, creator.topic, creator.location].filter(Boolean).join(" · ");
    byId("profile-badge").textContent = creator.badge;
    if (creator.status === "Не принимает рекламу") {
      byId("inquiry").hidden = true;
      document.querySelector('.profile__summary a[href="#inquiry"]').hidden = true;
    }
    byId("profile-bio").textContent = creator.bio;
    byId("profile-followers").textContent = number.format(creator.followers);
    byId("profile-status").textContent = creator.status || "";
    if (creator.engagement) {
      byId("profile-er").hidden = false;
      byId("profile-er").querySelector("strong").textContent = creator.engagement.replace(".", ",");
    }
    byId("profile-audience").textContent = creator.audience;
    byId("profile-description").textContent = creator.description || "";
    byId("inquiry-creator").value = creator.id;
    byId("inquiry-creator").defaultValue = creator.id;
    creator.platforms.forEach((platform, i) => {
      const link = document.createElement("a");
      link.href = creator.socials[i];
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = platform;
      link.title = "Открыть " + platform + " в новой вкладке";
      byId("profile-socials").append(link);
    });
    const formatSelect = byId("inquiry-format");
    creator.formats.forEach(format => {
      const item = document.createElement("li");
      const choose = document.createElement("a");
      choose.href = "#inquiry";
      choose.textContent = format;
      choose.addEventListener("click", () => { formatSelect.value = format; });
      if (byId("inquiry").hidden) item.textContent = format;
      else item.append(choose);
      byId("profile-formats").append(item);
      formatSelect.add(new Option(format, format));
    });
    formatSelect.add(new Option("Индивидуальный формат", "Индивидуальный формат"));
  }
  if (byId("filter-form")) initCatalog();
  if (byId("profile-shell")) initProfile();
})();
