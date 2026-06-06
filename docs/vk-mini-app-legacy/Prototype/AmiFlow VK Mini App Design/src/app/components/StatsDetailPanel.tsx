import {
  Card,
  Box,
  Button,
  Title,
  Text,
  Caption,
  Progress,
  Spacing,
  Separator,
} from "@vkontakte/vkui";
import { Icon20ArrowLeftOutline, Icon20ErrorCircleFillRed, Icon20CheckCircleFillGreen } from "@vkontakte/icons";

type PanelType = "completed" | "inprogress" | "errors" | null;

const completedTasks = [
  { id: 1, account: "Applexis", accountEmail: "applexis@avito-seller.ru", task: "Публикация iPhone 15 Pro", count: 48, time: "сегодня, 14:32" },
  { id: 2, account: "Applexis", accountEmail: "applexis@avito-seller.ru", task: "Обновление цен на MacBook", count: 12, time: "сегодня, 11:15" },
  { id: 3, account: "MotoDrive", accountEmail: "motodrive.seller@gmail.com", task: "Публикация запчастей BMW", count: 34, time: "вчера, 18:42" },
  { id: 4, account: "MotoDrive", accountEmail: "motodrive.seller@gmail.com", task: "Обновление фото объявлений", count: 21, time: "вчера, 09:10" },
  { id: 5, account: "HomeCraft", accountEmail: "homecraft.avito@yandex.ru", task: "Загрузка коллекции диванов", count: 27, time: "12 мар, 16:00" },
];

const inProgressTasks = [
  { id: 1, account: "Applexis", accountEmail: "applexis@avito-seller.ru", task: "Публикация AirPods Pro", count: 30, done: 18, status: "active" },
  { id: 2, account: "Applexis", accountEmail: "applexis@avito-seller.ru", task: "Обновление описаний", count: 50, done: 33, status: "active" },
  { id: 3, account: "MotoDrive", accountEmail: "motodrive.seller@gmail.com", task: "Загрузка запчастей Toyota", count: 45, done: 12, status: "queued" },
  { id: 4, account: "HomeCraft", accountEmail: "homecraft.avito@yandex.ru", task: "Публикация кресел", count: 20, done: 7, status: "active" },
];

const errorTasks = [
  { id: 1, account: "MotoDrive", accountEmail: "motodrive.seller@gmail.com", task: "Публикация запчастей Honda", error: "Превышен лимит публикаций", time: "сегодня, 13:05", severity: "high" },
  { id: 2, account: "HomeCraft", accountEmail: "homecraft.avito@yandex.ru", task: "Загрузка фото кухонь", error: "Ошибка загрузки фото", time: "сегодня, 10:22", severity: "medium" },
];

interface StatsDetailPanelProps {
  type: PanelType;
  onClose: () => void;
}

export function StatsDetailPanel({ type, onClose }: StatsDetailPanelProps) {
  if (!type) return null;

  const titles: Record<NonNullable<PanelType>, string> = {
    completed: "Завершённые задачи",
    inprogress: "Активные задачи",
    errors: "Ошибки",
  };

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
                142 задачи
              </span>
            </Caption>
            <Spacing size={4} />
            {completedTasks.map((t, i) => (
              <Card key={t.id} mode="shadow" style={{ borderRadius: 16 }}>
                <Box style={{ padding: "14px 16px" }}>
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
                </Box>
              </Card>
            ))}
          </>
        )}

        {/* ── In Progress ── */}
        {type === "inprogress" && (
          <>
            <Caption level="1" normalize style={{ color: "#818C99", display: "block" }}>
              Активных задач:{" "}
              <span style={{ fontWeight: 700, color: "var(--vkui--color_text_primary)" }}>4</span>
            </Caption>
            <Spacing size={4} />
            {inProgressTasks.map((t) => {
              const pct = Math.round((t.done / t.count) * 100);
              const isActive = t.status === "active";
              return (
                <Card key={t.id} mode="shadow" style={{ borderRadius: 16 }}>
                  <Box style={{ padding: "14px 16px" }}>
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
                  </Box>
                </Card>
              );
            })}
          </>
        )}

        {/* ── Errors ── */}
        {type === "errors" && (
          <>
            <Caption level="1" normalize style={{ color: "#818C99", display: "block" }}>
              Активных ошибок:{" "}
              <span style={{ fontWeight: 700, color: "#ef4444" }}>2</span>
            </Caption>
            <Spacing size={4} />
            {errorTasks.map((t) => (
              <Card key={t.id} mode="shadow" style={{ borderRadius: 16 }}>
                <Box style={{ padding: "14px 16px" }}>
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
                </Box>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export type { PanelType };