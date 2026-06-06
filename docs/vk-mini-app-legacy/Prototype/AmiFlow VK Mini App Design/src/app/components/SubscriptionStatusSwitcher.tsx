import { useState } from "react";
import {
  Button,
  Card,
  Box,
  Title,
  Text,
  Caption,
  Progress,
  Spacing,
} from "@vkontakte/vkui";
import {
  Icon20MegaphoneOutline,
  Icon20RefreshOutline,
  Icon20UserOutline,
  Icon20ArticleOutline,
  Icon16Stars,
} from "@vkontakte/icons";
import { SubscriptionSelectionWidget } from "./SubscriptionSelectionWidget";
import { useAppContext } from "../context/AppContext";

type SubState =
  | "trial_start"
  | "trial_active"
  | "trial_ended"
  | "lite_active"
  | "pro_active"
  | "expired";

// Map from app-level subscriptionStatus to UI SubState
const STATUS_TO_STATE: Record<string, SubState> = {
  free: "trial_start",
  trial_limits: "trial_active",
  trial_ended: "trial_ended",
  lite: "lite_active",
  pro: "pro_active",
  expired: "expired",
};

const STATES: SubState[] = [
  "trial_start",
  "trial_active",
  "trial_ended",
  "lite_active",
  "pro_active",
  "expired",
];

export function SubscriptionStatusSwitcher() {
  const { subscriptionStatus } = useAppContext();
  const [localIndex, setLocalIndex] = useState<number | null>(null);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  const derivedState: SubState = STATUS_TO_STATE[subscriptionStatus] ?? "trial_start";
  const currentState: SubState = localIndex !== null ? STATES[localIndex] : derivedState;

  const handleCycle = () => {
    const currentIdx = STATES.indexOf(currentState);
    setLocalIndex((currentIdx + 1) % STATES.length);
  };

  const limits = [
    {
      name: "5 публикаций",
      value: "0/5",
      progress: 0,
      icon: <Icon20MegaphoneOutline style={{ color: "#0077FF", flexShrink: 0 }} />,
    },
    {
      name: "10 обновлений",
      value: "0/10",
      progress: 0,
      icon: <Icon20RefreshOutline style={{ color: "#0077FF", flexShrink: 0 }} />,
    },
    {
      name: "1 аккаунт",
      value: "0/1",
      progress: 0,
      icon: <Icon20UserOutline style={{ color: "#0077FF", flexShrink: 0 }} />,
    },
    {
      name: "1 шаблон",
      value: "0/1",
      progress: 0,
      icon: <Icon20ArticleOutline style={{ color: "#0077FF", flexShrink: 0 }} />,
    },
  ];

  return (
    <div
      data-subscription-zone="true"
      onClick={handleCycle}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        width: "100%",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {/* ── trial_start ── */}
      {currentState === "trial_start" && (
        <div onClick={(e) => e.stopPropagation()}>
          <Button
            mode="primary"
            size="l"
            stretched
            onClick={() => alert("Кнопка «Начать пробный период»")}
            className="avify-cta-btn avify-cta-pill"
          >
            Начать пробный период
          </Button>
        </div>
      )}

      {/* ── trial_active — limit widget ── */}
      {currentState === "trial_active" && (
        <Card
          mode="outline"
          Component="div"
          style={{ width: "100%", borderRadius: 14 }}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <Box style={{ padding: "12px 12px 14px" }}>
            <Title
              level="3"
              weight="1"
              normalize
              style={{ marginBottom: 12, display: "block" }}
            >
              Пробный доступ по лимитам
            </Title>

            {/* 
              Adaptive grid:
              - 2 columns when parent is wide enough (min 140px per col)
              - falls back to 1 column on narrow screens
            */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                gap: "12px 12px",
              }}
            >
              {limits.map((item, idx) => (
                <div key={idx} style={{ minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 4,
                      marginBottom: 6,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        minWidth: 0,
                        overflow: "hidden",
                      }}
                    >
                      {item.icon}
                      <Caption
                        level="1"
                        weight="2"
                        normalize
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          minWidth: 0,
                        }}
                      >
                        {item.name}
                      </Caption>
                    </div>
                    <Caption
                      level="2"
                      normalize
                      style={{ flexShrink: 0, color: "var(--vkui--color_text_secondary)" }}
                    >
                      {item.value}
                    </Caption>
                  </div>
                  <Progress value={item.progress} />
                </div>
              ))}
            </div>
          </Box>
        </Card>
      )}

      {/* ── trial_ended — пробный период закончился ── */}
      {currentState === "trial_ended" && (
        <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
          <Button
            mode="primary"
            size="l"
            stretched
            onClick={() => setIsWidgetOpen(true)}
            className="avify-cta-btn avify-cta-pill"
          >
            Оформить подписку
          </Button>
          <Caption level="1" normalize style={{ color: "var(--vkui--color_text_secondary)", textAlign: "center", display: "block" }}>
            Пробный период закончился
          </Caption>
        </div>
      )}

      {/* ── lite_active ── */}
      {currentState === "lite_active" && (
        <div className="avify-lite-badge">
          <svg width="12" height="10" viewBox="0 0 14 11" fill="none" style={{ flexShrink: 0, display: "block" }}>
            <path
              d="M1.5 5.5L5 9L12.5 1.5"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Caption level="1" weight="1" normalize style={{ color: "white" }}>
            Lite — активна до 12.05.26
          </Caption>
        </div>
      )}

      {/* ── pro_active ── */}
      {currentState === "pro_active" && (
        <div className="avify-pro-badge">
          <Icon16Stars style={{ color: "white", flexShrink: 0 }} />
          <Caption
            level="1"
            weight="1"
            normalize
            style={{ color: "white" }}
          >
            Pro — активна до 12.05.25
          </Caption>
        </div>
      )}

      {/* ── expired ── */}
      {currentState === "expired" && (
        <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
          <Button
            mode="primary"
            size="l"
            stretched
            onClick={() => setIsWidgetOpen(true)}
            className="avify-cta-btn avify-cta-pill"
          >
            Продлить подписку
          </Button>
          <Caption level="1" normalize style={{ color: "var(--vkui--color_text_secondary)", textAlign: "center", display: "block" }}>
            Подписка истекла
          </Caption>
        </div>
      )}

      <Spacing size={0} />

      <SubscriptionSelectionWidget
        isOpen={isWidgetOpen}
        onClose={() => setIsWidgetOpen(false)}
      />
    </div>
  );
}