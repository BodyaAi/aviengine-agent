import { useState } from "react";
import { createPortal } from "react-dom";
import {
  Button,
  SegmentedControl,
  ConfigProvider,
  AdaptivityProvider,
  Title,
  Text,
  Caption,
  Spacing,
} from "@vkontakte/vkui";
import {
  Icon24Dismiss,
  Icon16Done,
  Icon16Add,
  Icon20Stars,
  Icon20FlashOutline,
  Icon20CopyOutline,
} from "@vkontakte/icons";
import "@vkontakte/vkui/dist/vkui.css";

export function SubscriptionSelectionWidget({
  isOpen,
  onClose,
  appearance,
}) {
  const [proPeriod, setProPeriod] = useState("3");

  if (!isOpen) return null;

  const liteFeatures = [
    "До 10 активных аккаунтов",
    "AI-Контент: Уникальные заголовки и описания",
    "Smart-Уникализация: Тасовка городов, уникализация фото",
    "Анти-Бан: Мониторинг лимитов и безопасные интервалы",
    "Облачный запуск: Настроил шаблон — и пошел пить кофе",
    "Автообновление объявлений: AI автоматически обновляет объявления, выбирая оптимальный момент для повышения эффективности.",
  ];

  const proExclusiveFeatures = [
    {
      icon: <Icon20Stars style={{ color: "#FBBF24" }} />,
      text: "До 20 активных аккаунтов",
    },
    {
      icon: (
        <Icon20FlashOutline
          style={{ color: "rgba(255,255,255,0.9)" }}
        />
      ),
      text: "Кнопка «РЕШИТЬ ЧЕРЕЗ AI»: Решение ошибок AI агентом",
    },
    {
      icon: (
        <Icon20CopyOutline
          style={{ color: "rgba(255,255,255,0.9)" }}
        />
      ),
      text: "Smart-Миграция: ИИ сам копирует лучшие объявления по аккаунтам",
    },
  ];

  return createPortal(
    <ConfigProvider appearance={appearance}>
      <AdaptivityProvider>
        {/* ── Backdrop ── */}
        <div
          data-subscription-zone="true"
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* ── Modal container ── */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 860,
              maxHeight: "95vh",
              backgroundColor:
                "var(--vkui--color_background, #FFFFFF)",
              borderRadius: 32,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
            }}
          >
            {/* ── Close button ── */}
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                zIndex: 20,
              }}
            >
              <Button
                mode="tertiary"
                appearance="neutral"
                size="m"
                before={<Icon24Dismiss />}
                onClick={onClose}
                aria-label="Закрыть"
                style={{
                  borderRadius: 20,
                  minWidth: 40,
                  height: 40,
                  padding: "0 8px",
                }}
              />
            </div>

            {/* ── Scrollable content ── */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "52px 20px 28px",
                scrollbarWidth: "none",
              }}
            >
              {/* ── Header ── */}
              <div style={{ textAlign: "center" }}>
                <Title
                  level="1"
                  weight="1"
                  normalize
                  style={{ color: "#0077FF", display: "block" }}
                >
                  Avify
                </Title>

                <Spacing size={6} />

                <Title
                   level="2"
                   weight="1"
                   normalize
                   style={{ color: "var(--vkui--color_text_primary)", display: "block" }}
                 >
                   Хватит нянчиться с выкладчиками.
                 </Title>
                <Title
                  level="2"
                  weight="1"
                  normalize
                  style={{ color: "#0077FF", display: "block" }}
                >
                  Переходи на AI-автопилот.
                </Title>

                <Spacing size={10} />

                <Text
                  normalize
                  style={{ color: "var(--vkui--color_text_secondary)", display: "block" }}
                >
                  Для тех, кто хочет освободить время
                </Text>

                <Spacing size={16} />

                {/* Early access badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "8px 18px",
                    borderRadius: 20,
                    backgroundColor: "#FFFBEB",
                    border: "1px solid #FEF3C7",
                  }}
                >
                  <Caption
                    level="1"
                    weight="1"
                    normalize
                    style={{ color: "#D97706" }}
                  >
                    10 мест раннего доступа. Далее цена выше.
                  </Caption>
                </div>
              </div>

              <Spacing size={24} />

              {/* ── Cards grid ── */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 16,
                  alignItems: "stretch",
                }}
              >
                {/* ════ LITE Card ════ */}
                <div
                  style={{
                    borderRadius: 28,
                    padding: 24,
                    background:
                      "linear-gradient(135deg, #c026d3 0%, #38bdf8 100%)",
                    display: "flex",
                    flexDirection: "column",
                    color: "white",
                    boxShadow:
                      "0 8px 24px rgba(192,38,211,0.28)",
                  }}
                >
                  {/* Plan label */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignSelf: "flex-start",
                      padding: "4px 12px",
                      borderRadius: 999,
                      marginBottom: 16,
                      backgroundColor: "rgba(255,255,255,0.18)",
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    <Caption
                      level="1"
                      weight="1"
                      normalize
                      caps
                      style={{
                        color: "white",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Подписка LITE
                    </Caption>
                  </div>

                  {/* Price */}
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 52,
                          fontWeight: 900,
                          lineHeight: 1,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        19 999
                      </span>
                      <span
                        style={{
                          fontSize: 22,
                          fontWeight: 700,
                          opacity: 0.9,
                        }}
                      >
                        ₽
                      </span>
                    </div>
                    <Caption
                      level="1"
                      normalize
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        display: "block",
                        marginTop: 4,
                      }}
                    >
                      ежемесячный платеж
                    </Caption>
                  </div>

                  {/* Feature list */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      marginBottom: 20,
                    }}
                  >
                    {liteFeatures.map((feat, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor:
                              "rgba(255,255,255,0.22)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginTop: 2,
                          }}
                        >
                          <Icon16Done
                            style={{ color: "white" }}
                          />
                        </div>
                        <Text
                          normalize
                          style={{
                            color: "white",
                            fontSize: 13,
                            lineHeight: "1.45",
                          }}
                        >
                          {feat}
                        </Text>
                      </div>
                    ))}
                  </div>

                {/* CTA */}
                  <Button 
                    size="l" 
                    stretched
                    className="avify-cta-btn"
                    style={{ 
                      borderRadius: 14,
                      fontWeight: 700,
                    }}
                  >
                    Выбрать Lite
                  </Button>
                </div>

                {/* ════ PRO Card ════ */}
                <div
                  style={{
                    borderRadius: 28,
                    padding: 24,
                    position: "relative",
                    background:
                      "linear-gradient(145deg, #0a192f 0%, #112240 20%, #1e3a8a 40%, #3b82f6 50%, #1e3a8a 60%, #112240 80%, #0a192f 100%)",
                    display: "flex",
                    flexDirection: "column",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.1)",
                    isolation: "isolate",
                    boxShadow:
                      "0 8px 32px rgba(30,58,138,0.38)",
                  }}
                >
                  {/* Shine overlay — z-index: -1 keeps it below normal flow */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      zIndex: -1,
                      pointerEvents: "none",
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%, rgba(255,255,255,0.07) 100%)",
                      borderRadius: 28,
                    }}
                  />

                  {/* Plan label */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignSelf: "flex-start",
                      padding: "4px 12px",
                      borderRadius: 999,
                      marginBottom: 16,
                      backgroundColor: "rgba(59,130,246,0.3)",
                      border: "1px solid rgba(147,197,253,0.3)",
                    }}
                  >
                    <Caption
                      level="1"
                      weight="1"
                      normalize
                      caps
                      style={{
                        color: "white",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Подписка PRO
                    </Caption>
                  </div>

                  {/* Price */}
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 52,
                          fontWeight: 900,
                          lineHeight: 1,
                          letterSpacing: "-0.02em",
                          background:
                            "linear-gradient(to bottom, #ffffff, #bbdefb)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {proPeriod === "3"
                          ? "89 999"
                          : "34 999"}
                      </span>
                      <span
                        style={{
                          fontSize: 22,
                          fontWeight: 700,
                          opacity: 0.9,
                        }}
                      >
                        ₽
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 4,
                      }}
                    >
                      <Caption
                        level="1"
                        normalize
                        style={{
                          color: "rgba(255,255,255,0.85)",
                        }}
                      >
                        {proPeriod === "3"
                          ? "29 999 ₽ в месяц"
                          : "Оплата помесячно"}
                      </Caption>
                      {proPeriod === "3" && (
                        <span
                          style={{
                            backgroundColor: "#F59E0B",
                            color: "#78350F",
                            fontSize: 10,
                            fontWeight: 800,
                            padding: "2px 7px",
                            borderRadius: 4,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                          }}
                        >
                          Выгоднее
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Period toggle */}
                  <div style={{ marginBottom: 20 }}>
                    <SegmentedControl
                      size="m"
                      value={proPeriod}
                      onChange={(value) =>
                        setProPeriod(value)
                      }
                      options={[
                        { label: "1 МЕСЯЦ", value: "1" },
                        { label: "3 МЕСЯЦА", value: "3" },
                      ]}
                      style={{
                        backgroundColor: "var(--vkui--color_background_secondary)",
                        borderRadius: 12,
                      }}
                    />
                  </div>

                  {/* PRO exclusive features */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      marginBottom: 20,
                    }}
                  >
                    {proExclusiveFeatures.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor:
                              "rgba(255,255,255,0.15)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginTop: 2,
                          }}
                        >
                          {item.icon}
                        </div>
                        <Text
                          weight="2"
                          normalize
                          style={{
                            color: "white",
                            fontSize: 13,
                            lineHeight: "1.45",
                          }}
                        >
                          {item.text}
                        </Text>
                      </div>
                    ))}

                    {/* Includes LITE */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        opacity: 0.7,
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          backgroundColor:
                            "rgba(255,255,255,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        <Icon16Add style={{ color: "white" }} />
                      </div>
                      <Text
                        normalize
                        style={{
                          color: "white",
                          fontSize: 13,
                          lineHeight: "1.45",
                          fontStyle: "italic",
                        }}
                      >
                        Все функции тарифа LITE включены
                      </Text>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    size="l"
                    stretched
                    className="avify-cta-btn"
                    style={{
                      borderRadius: 14,
                      fontWeight: 700,
                    }}
                  >
                    Активировать Pro
                  </Button>
                </div>
              </div>

              <Spacing size={20} />

              {/* Footer */}
              <Caption
                level="2"
                normalize
                align="center"
                caps
                style={{
                  display: "block",
                  color: "var(--vkui--color_text_secondary)",
                  letterSpacing: "0.1em",
                  opacity: 0.55,
                }}
              >
                Avify • Премиальный AI-Инструмент для бизнеса
              </Caption>
            </div>
          </div>
        </div>
      </AdaptivityProvider>
    </ConfigProvider>,
    document.body,
  );
}
