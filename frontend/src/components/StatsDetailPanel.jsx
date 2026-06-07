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
            <Caption level="1" normalize style={{ color: "var(--vkui--color_text_secondary, #818C99)", display: "block" }}>
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
                        <Caption level="1" normalize style={{ color: "#818C99", display: "block", marginTop: 2 }}>
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
                          backgroundColor: "#EEFAF3",
                        }}
                      >
                        <Icon20CheckCircleFillGreen style={{ width: 14, height: 14 }} />
                        <Caption level="1" weight="2" normalize style={{ color: "#22c55e" }}>{t.count}</Caption>
                      </div>
                    </div>
                    <Spacing size={6} />
                    <Caption level="2" normalize style={{ color: "#c0c0cc", display: "block" }}>{t.time}</Caption>
                  </Div>
                </Card>
              ))
            )}
          </>
        )}

        {/* ── In Progress ── */}
        {type === "inprogress" && (
          <>
            <Caption level="1" normalize style={{ color: "#818C99", display: "block" }}>
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
                          <Caption level="1" normalize style={{ color: "#818C99", display: "block", marginTop: 2 }}>
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
                            backgroundColor: isActive ? "#EEF4FF" : "#FFF8EE",
                            color: isActive ? "#0077FF" : "#f59e0b",
                          }}
                        >
                          {isActive ? "⚡ Работает" : "⏳ Очередь"}
                        </Caption>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <Caption level="2" normalize style={{ color: "#818C99" }}>{t.done} из {t.count}</Caption>
                        <Caption level="2" weight="2" normalize style={{ color: "#0077FF" }}>{pct}%</Caption>
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
            <Caption level="1" normalize style={{ color: "#818C99", display: "block" }}>
              Активных ошибок:{" "}
              <span style={{ fontWeight: 700, color: "#ef4444" }}>{errorTasks.length}</span>
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
                        <Caption level="1" normalize style={{ color: "#818C99", display: "block", marginTop: 2 }}>
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
                          backgroundColor: t.severity === "high" ? "#FFF0F0" : "#FFF8EE",
                          color: t.severity === "high" ? "#ef4444" : "#f59e0b",
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
                        backgroundColor: "#FFF0F0",
                        borderRadius: 12,
                        padding: "8px 12px",
                      }}
                    >
                      <Icon20ErrorCircleFillRed style={{ flexShrink: 0 }} />
                      <Text normalize style={{ color: "#ef4444", fontSize: 13 }}>{t.error}</Text>
                    </div>

                    <Spacing size={8} />
                    <Separator />
                    <Spacing size={8} />

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Caption level="2" normalize style={{ color: "#c0c0cc" }}>{t.time}</Caption>
                      <Button mode="link" size="s" style={{ color: "#0077FF" }}>
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

