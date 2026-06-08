import bridge from "@vkontakte/vk-bridge";

// Инициализация VK Mini App
bridge.send("VKWebAppInit");

// Установка статус-бара
bridge.send("VKWebAppSetViewSettings", {
  status_bar_style: "dark",
  action_bar_color: "#ffffff",
});

// Обработка изменений темы
bridge.subscribe((event) => {
  if (event.detail.type === "VKWebAppUpdateConfig") {
    const { appearance } = event.detail.data;
    document.documentElement.setAttribute(
      "data-theme",
      appearance === "dark" ? "dark" : "light"
    );
  }
});

export default bridge;
