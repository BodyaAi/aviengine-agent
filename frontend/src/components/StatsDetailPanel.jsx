import {
  Card,
  Div,
  Button,
  Title,
  Text,
  Caption,
  Progress,
  Spacing,
  Separator,
} from "@vkontakte/vkui";
import { Icon20ArrowLeftOutline, Icon20ErrorCircleFillRed, Icon20CheckCircleFillGreen } from "@vkontakte/icons";

const titles = {
  completed: "Завершённые задачи",
  inprogress: "Активные задачи",
  errors: "Ошибки",
};

export function StatsDetailPanel({ type, onClose, completedTasks = [], inProgressTasks = [], errorTasks = [] }) {
  if (!type) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 430,
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
        background: "var(--vkui--color_background_secondary, #f5f5fa)",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 16px",
          background: "var(--vkui--color_background, white)",
          borderBottom: "1px solid var(--vkui--color_separator_primary, #f0f0f5)",
          flexShrink: 0,
        }}
      >
        <Button
          mode="tertiary"
          appearance="neutral"
          size="m"
          before={<Icon20ArrowLeftOutline />}
          onClick={onClose}
          style={{ borderRadius: 12 }}
        />
        <Title level="3" weight="2" normalize style={{ flex: 1 }}>
          {titles[type]}
        </Title>
      </div>

      {/* ── Content ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* ── Completed ── */}
        {type === "completed" && (
          <>
            <Caption level="1" normalize style={{ color: "var(--vkui--color_text_secondary)", display: "block" }}>
              Всего завершено:{" "}
              <span style={{ fontWeight: 700, color: "var(--vkui--color_text_primary, #1a1a2e)" }}>
                {completedTasks.length} {completedTasks.length === 1 ? "задача" : completedTasks.length < 5 ? "задачи" : "задач"}
              </span>
            </Caption>
            <Spacing size={4} />
            {completedTasks.length === 0 ? (
              <Text style={{ color: "var(--vkui--color_text_secondary)", textAlign: "center", padding: "24px 0" }}>
                Нет завершённых задач
              </Text>
            ) : (
              completedTasks.map((t) => (
                <Card key={t.id} mode="shadow" style={{ borderRadius: 16 }}>
                  <Div style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text weight="2" normalize style={{ display: "block" }}>{t.task}</Text>
                        <Caption level="1" normalize style={{ color: "var(--vkui--color_text_secondary)", display: "block", marginTop: 2 }}>
                          {t.account} · {t.accountEmail}
                        </Caption>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          flexShrink: 0,
                          padding: "4px 8px",
                          borderRadius: 10,
                          backgroundColor: "var(--vkui--color_background_positive)",
                        }}
                      >
                        <Icon20CheckCircleFillGreen style={{ width: 14, height: 14 }} />
                        <Caption level="1" weight="2" normalize style={{ color: "var(--vkui--color_accent_green)" }}>{t.count}</Caption>
                      </div>
                    </div>
                    <Spacing size={6} />
                    <Caption level="2" normalize style={{ color: "var(--vkui--color_text_secondary)", display: "block" }}>{t.time}</Caption>
                  </Div>
                </Card>
              ))
            )}
          </>
        )}

        {/* ── In Progress ── */}
        {type === "inprogress" && (
          <>
            <Caption level="1" normalize style={{ color: "var(--vkui--color_text_secondary)", display: "block" }}>
              Активных задач:{" "}
              <span style={{ fontWeight: 700, color: "var(--vkui--color_text_primary)" }}>{inProgressTasks.length}</span>
            </Caption>
            <Spacing size={4} />
            {inProgressTasks.length === 0 ? (
              <Text style={{ color: "var(--vkui--color_text_secondary)", textAlign: "center", padding: "24px 0" }}>
                Нет активных задач
              </Text>
            ) : (
              inProgressTasks.map((t) => {
                const pct = t.count > 0 ? Math.round((t.done / t.count) * 100) : 0;
                const isActive = t.status === "active";
                return (
                  <Card key={t.id} mode="shadow" style={{ borderRadius: 16 }}>
                    <Div style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Text weight="2" normalize style={{ display: "block" }}>{t.task}</Text>
                          <Caption level="1" normalize style={{ color: "var(--vkui--color_text_secondary)", display: "block", marginTop: 2 }}>
                            {t.account} · {t.accountEmail}
                          </Caption>
                        </div>
                        <Caption
                          level="1"
                          weight="2"
                          normalize
                          style={{
                            flexShrink: 0,
                            padding: "4px 8px",
                            borderRadius: 10,
                            backgroundColor: isActive ? "var(--vkui--color_background_accent_themed)" : "var(--vkui--color_background_warning)",
                            color: isActive ? "var(--vkui--color_accent_blue)" : "var(--vkui--color_accent_orange)",
                          }}
                        >
                          {isActive ? "⚡ Работает" : "⏳ Очередь"}
                        </Caption>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <Caption level="2" normalize style={{ color: "var(--vkui--color_text_secondary)" }}>{t.done} из {t.count}</Caption>
                        <Caption level="2" weight="2" normalize style={{ color: "var(--vkui--color_accent_blue)" }}>{pct}%</Caption>
                      </div>
                      <Progress value={pct} />
                    </Div>
                  </Card>
                );
              })
            )}
          </>
        )}

        {/* ── Errors ── */}
        {type === "errors" && (
          <>
            <Caption level="1" normalize style={{ color: "var(--vkui--color_text_secondary)", display: "block" }}>
              Активных ошибок:{" "}
              <span style={{ fontWeight: 700, color: "var(--vkui--color_accent_red)" }}>{errorTasks.length}</span>
            </Caption>
            <Spacing size={4} />
            {errorTasks.length === 0 ? (
              <Text style={{ color: "var(--vkui--color_text_secondary)", textAlign: "center", padding: "24px 0" }}>
                Нет активных ошибок
              </Text>
            ) : (
              errorTasks.map((t) => (
                <Card key={t.id} mode="shadow" style={{ borderRadius: 16 }}>
                  <Div style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text weight="2" normalize style={{ display: "block" }}>{t.task}</Text>
                        <Caption level="1" normalize style={{ color: "var(--vkui--color_text_secondary)", display: "block", marginTop: 2 }}>
                          {t.account} · {t.accountEmail}
                        </Caption>
                      </div>
                      <Caption
                        level="1"
                        weight="2"
                        normalize
                        style={{
                          flexShrink: 0,
                          padding: "4px 8px",
                          borderRadius: 10,
                          backgroundColor: t.severity === "high" ? "var(--vkui--color_background_negative)" : "var(--vkui--color_background_warning)",
                          color: t.severity === "high" ? "var(--vkui--color_accent_red)" : "var(--vkui--color_accent_orange)",
                        }}
                      >
                        {t.severity === "high" ? "● Высокий" : "● Средний"}
                      </Caption>
                    </div>

                    <Spacing size={8} />

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        backgroundColor: "var(--vkui--color_background_negative)",
                        borderRadius: 12,
                        padding: "8px 12px",
                      }}
                    >
                      <Icon20ErrorCircleFillRed style={{ flexShrink: 0 }} />
                      <Text normalize style={{ color: "var(--vkui--color_accent_red)", fontSize: 13 }}>{t.error}</Text>
                    </div>

                    <Spacing size={8} />
                    <Separator />
                    <Spacing size={8} />

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Caption level="2" normalize style={{ color: "var(--vkui--color_text_secondary)" }}>{t.time}</Caption>
                      <Button mode="link" size="s" style={{ color: "var(--vkui--color_accent_blue)" }}>
                        Исправить →
                      </Button>
                    </div>
                  </Div>
                </Card>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

