import { useState } from "react";
import {
  Card,
  Box,
  Button,
  Title,
  Text,
  Caption,
  Separator,
  Spacing,
  Progress,
} from "@vkontakte/vkui";
import {
  Icon20Stars,
  Icon20MegaphoneOutline,
  Icon20RefreshOutline,
  Icon20UserOutline,
  Icon20ArticleOutline,
} from "@vkontakte/icons";
import avifyLogo from "figma:asset/83ad018e457e6e4bb595c06474fa13375d08f06e.png";

type SubState =
  | "trial_start"
  | "trial_active"
  | "trial_ended"
  | "lite_active"
  | "pro_active"
  | "expired";

const STATES: SubState[] = [
  "trial_start",
  "trial_active",
  "trial_ended",
  "lite_active",
  "pro_active",
  "expired",
];

const trialLimits = [
  { name: "1 аккаунт", value: "0/1", progress: 0, icon: <Icon20UserOutline style={{ color: "#0077FF" }} /> },
  { name: "5 публикаций", value: "0/5", progress: 0, icon: <Icon20MegaphoneOutline style={{ color: "#0077FF" }} /> },
  { name: "10 обновлений", value: "0/10", progress: 0, icon: <Icon20RefreshOutline style={{ color: "#0077FF" }} /> },
  { name: "1 шаблон", value: "0/1", progress: 0, icon: <Icon20ArticleOutline style={{ color: "#0077FF" }} /> },
];

export function SubscriptionCard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentState = STATES[currentIndex];

  const handleCycle = () => {
    setCurrentIndex((prev) => (prev + 1) % STATES.length);
  };

  return (
    <Card mode="shadow" style={{ borderRadius: 20, cursor: "pointer" }} onClick={handleCycle}>
      <Box style={{ padding: "16px 18px" }}>
        {/* Top row: logo + brand + help */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <img
            src={avifyLogo}
            alt="Avify"
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              objectFit: "cover",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          />
          <div style={{ flex: 1, minWidth: 0, marginTop: 2 }}>
            <Title level="1" weight="2" normalize style={{ letterSpacing: "-0.5px", display: "block" }}>
              Avify
            </Title>
            <Caption
              level="1"
              normalize
              style={{
                color: "var(--vkui--color_text_secondary, #818C99)",
                display: "block",
                marginTop: 6,
                lineHeight: 1.4,
              }}
            >
              AI-агент ведёт ваш аккаунт Авито: создаёт, уникализирует и публикует объявления.
            </Caption>
          </div>
          <Button
            mode="tertiary"
            appearance="neutral"
            size="s"
            style={{ borderRadius: "50%", minWidth: 32, height: 32, padding: 0, flexShrink: 0 }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0-3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm.7-3.8c-.5.4-.7.8-.7 1.3H6.8c0-1.1.5-1.8 1.2-2.3.6-.4.9-.8.9-1.2 0-.6-.5-1-1.1-1C7 4.5 6.5 5 6.5 5.7H5.2c0-1.4 1-2.2 2.6-2.2 1.6 0 2.5 1 2.5 2.1 0 .9-.5 1.5-1.6 2.1z"
                fill="var(--vkui--color_icon_accent, #0077FF)"
              />
            </svg>
          </Button>
        </div>

        <Spacing size={14} />
        <Separator />
        <Spacing size={12} />

        {/* ── Dynamic subscription state ── */}

        {currentState === "trial_start" && (
          <Button
            mode="primary"
            size="m"
            className="avify-cta-btn"
            onClick={(e) => e.stopPropagation()}
          >
            Начать пробный период
          </Button>
        )}

        {currentState === "trial_active" && (
          <div onClick={(e) => e.stopPropagation()}>
            <Title level="3" weight="1" normalize style={{ marginBottom: 14, display: "block" }}>
              Пробный доступ по лимитам
            </Title>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 16, rowGap: 12 }}>
              {trialLimits.map((item) => (
                <div key={item.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>{item.icon}</span>
                      <Caption level="1" weight="2" normalize style={{ whiteSpace: "nowrap" }}>{item.name}</Caption>
                    </div>
                    <Caption level="1" weight="2" normalize style={{ flexShrink: 0, color: "#818C99" }}>{item.value}</Caption>
                  </div>
                  <Progress value={item.progress} />
                </div>
              ))}
            </div>
          </div>
        )}

        {currentState === "trial_ended" && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }} onClick={(e) => e.stopPropagation()}>
            <Button
              mode="primary"
              size="m"
              className="avify-cta-btn"
            >
              Оформить подписку
            </Button>
            <Caption level="1" normalize style={{ color: "var(--vkui--color_text_secondary)" }}>
              Пробный период закончился
            </Caption>
          </div>
        )}

        {currentState === "lite_active" && (
          <div className="avify-lite-badge">
            <svg width="12" height="10" viewBox="0 0 14 11" fill="none" style={{ display: "block", flexShrink: 0 }}>
              <path d="M1.5 5.5L5 9L12.5 1.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <Text weight="2" normalize style={{ color: "white" }}>
              Lite — активна до 12.05.26
            </Text>
          </div>
        )}

        {currentState === "pro_active" && (
          <div className="avify-pro-badge">
            <Icon20Stars style={{ color: "white", flexShrink: 0 }} />
            <Text weight="2" normalize style={{ color: "white" }}>
              Pro — активна до 12.05.25
            </Text>
          </div>
        )}

        {currentState === "expired" && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }} onClick={(e) => e.stopPropagation()}>
            <Button
              mode="primary"
              size="m"
              className="avify-cta-btn"
            >
              Продлить подписку
            </Button>
            <Caption level="1" normalize style={{ color: "var(--vkui--color_text_secondary)" }}>
              Подписка истекла
            </Caption>
          </div>
        )}
      </Box>
    </Card>
  );
}