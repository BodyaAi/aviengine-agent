import { Card, Div, Button, Title, Text, Caption } from "@vkontakte/vkui";
import { Icon20Stars } from "@vkontakte/icons";

function SubscriptionNone({ onSubscribe }) {
  return (
    <Card mode="shadow" style={{ borderRadius: 20 }}>
      <Div style={{ padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <Caption level="1" weight="1" normalize caps style={{ color: "var(--vkui--color_text_secondary)", letterSpacing: "0.07em", display: "block" }}>
            Подписка
          </Caption>
          <Title level="3" weight="2" normalize style={{ marginTop: 4, display: "block" }}>
            Не оформлена
          </Title>
          <Caption level="1" normalize style={{ color: "var(--vkui--color_text_secondary)", display: "block", marginTop: 2 }}>
            Разблокируйте AI-агента
          </Caption>
        </div>
        <Button mode="secondary" size="m" onClick={onSubscribe} before={<Icon20Stars />}>
          Оформить
        </Button>
      </Div>
    </Card>
  );
}

function SubscriptionPro({ api_plan, api_expire_date, onManage }) {
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
        before={<Icon20Stars />}
        style={{ flexShrink: 0 }}
      >
        Управление
      </Button>
    </div>
  );
}

function SubscriptionPremium({ api_plan, api_expire_date, onManage }) {
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

export function SubscriptionBlock({ api_status, api_plan, api_expire_date, onSubscribe, onManage }) {
  if (api_status === "premium") {
    return <SubscriptionPremium api_plan={api_plan} api_expire_date={api_expire_date} onManage={onManage} />;
  }
  if (api_status === "pro") {
    return <SubscriptionPro api_plan={api_plan} api_expire_date={api_expire_date} onManage={onManage} />;
  }
  return <SubscriptionNone onSubscribe={onSubscribe} />;
}

