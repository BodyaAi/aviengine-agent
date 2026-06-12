// ─── Subscription Block — VKUI native ──────────────────────
// API placeholders: api_status, api_plan, api_expire_date
// VK Bridge: bridge.send('VKWebAppShowSubscriptionBox', { action: 'create', item: 'avify_pro' })

import { Card, Box, Button, Title, Text, Caption } from "@vkontakte/vkui";
import { Icon20Stars, Icon20CrownOutline } from "@vkontakte/icons";

export type SubscriptionStatus = "none" | "pro" | "premium";

export interface SubscriptionBlockProps {
  api_status: SubscriptionStatus;
  api_plan?: string;
  api_expire_date?: string;
  onSubscribe?: () => void;
  onManage?: () => void;
}

// ── None ──────────────────────────────────────────────────
function SubscriptionNone({ onSubscribe }: { onSubscribe?: () => void }) {
  return (
    <Card mode="shadow" style={{ borderRadius: 20 }}>
      <Box style={{ padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <Caption level="1" weight="1" normalize caps style={{ color: "#818C99", letterSpacing: "0.07em", display: "block" }}>
            Подписка
          </Caption>
          <Title level="3" weight="2" normalize style={{ marginTop: 4, display: "block" }}>
            Не оформлена
          </Title>
          <Caption level="1" normalize style={{ color: "#818C99", display: "block", marginTop: 2 }}>
            Разблокируйте AI-агента
          </Caption>
        </div>
        <Button mode="secondary" size="m" onClick={onSubscribe} before={<Icon20Stars />}>
          Оформить
        </Button>
      </Box>
    </Card>
  );
}

// ── Pro ───────────────────────────────────────────────────
function SubscriptionPro({
  api_plan,
  api_expire_date,
  onManage,
}: {
  api_plan?: string;
  api_expire_date?: string;
  onManage?: () => void;
}) {
  const planName = api_plan ?? "Pro";
  const expireDate = api_expire_date ?? "—";

  return (
    <div
      style={{
        borderRadius: 20,
        background: "linear-gradient(135deg, #0077FF, #00AAFF)",
        padding: "16px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        boxShadow: "0 6px 20px rgba(0,119,255,0.28)",
      }}
    >
      <div>
        <Caption level="1" weight="1" normalize caps style={{ color: "rgba(255,255,255,0.65)", letterSpacing: "0.07em", display: "block" }}>
          Подписка
        </Caption>
        <Text weight="2" normalize style={{ color: "white", display: "block", marginTop: 4 }}>
          {planName} — Активна ✓
        </Text>
        <Caption level="1" normalize style={{ color: "rgba(255,255,255,0.72)", display: "block", marginTop: 2 }}>
          До {expireDate}
        </Caption>
      </div>
      <Button
        mode="primary"
        appearance="overlay"
        size="m"
        onClick={onManage}
        before={<Icon20CrownOutline />}
        style={{ flexShrink: 0 }}
      >
        Управление
      </Button>
    </div>
  );
}

// ── Premium ───────────────────────────────────────────────
function SubscriptionPremium({
  api_plan,
  api_expire_date,
  onManage,
}: {
  api_plan?: string;
  api_expire_date?: string;
  onManage?: () => void;
}) {
  const planName = api_plan ?? "Premium";
  const expireDate = api_expire_date ?? "—";

  return (
    <div
      style={{
        borderRadius: 20,
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        padding: "16px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 6px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <div>
        <Caption level="1" weight="1" normalize caps style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.09em", display: "block" }}>
          Подписка
        </Caption>
        <Text weight="2" normalize style={{ color: "white", display: "block", marginTop: 4 }}>
          {planName} — Активна ✓
        </Text>
        <Caption level="1" normalize style={{ color: "rgba(255,255,255,0.5)", display: "block", marginTop: 2 }}>
          До {expireDate}
        </Caption>
      </div>
      <Button
        mode="primary"
        appearance="overlay"
        size="m"
        onClick={onManage}
        before={<Icon20Stars />}
        style={{ flexShrink: 0, backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
      >
        Управление
      </Button>
    </div>
  );
}

// ── Public export ─────────────────────────────────────────
export function SubscriptionBlock({
  api_status,
  api_plan,
  api_expire_date,
  onSubscribe,
  onManage,
}: SubscriptionBlockProps) {
  if (api_status === "premium") {
    return <SubscriptionPremium api_plan={api_plan} api_expire_date={api_expire_date} onManage={onManage} />;
  }
  if (api_status === "pro") {
    return <SubscriptionPro api_plan={api_plan} api_expire_date={api_expire_date} onManage={onManage} />;
  }
  return <SubscriptionNone onSubscribe={onSubscribe} />;
}