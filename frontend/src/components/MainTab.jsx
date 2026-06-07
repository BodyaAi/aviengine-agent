import { useState } from "react";
import {
  Card,
  Div,
  Button,
  Title,
  Text,
  Caption,
  Progress,
  Spacing,
} from "@vkontakte/vkui";
import {
  Icon20ArticleOutline,
  Icon20PlayCircle,
  Icon20CheckCircleFillGreen,
  Icon20ErrorCircleFillRed,
  Icon20ClockOutline,
} from "@vkontakte/icons";
import { StatsDetailPanel } from "./StatsDetailPanel";
import { SubscriptionBlock } from "./SubscriptionBlock";

export function MainTab({
  liveTasks = [],
  onSwitchTab,
  onRemoveTask,
  onClearTasks,
  subscriptionStatus = "none",
  subscriptionPlan,
  subscriptionExpireDate,
  onSubscribe,
  onManageSubscription,
  completedTasks = [],
  inProgressTasks = [],
  errorTasks = [],
}) {
  const [statsPanelType, setStatsPanelType] = useState(null);

  const completedCount = completedTasks.length;
  const inProgressCount = inProgressTasks.length;
  const errorCount = errorTasks.length;

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "20px 16px 40px" }}>
        {/* ── Subscription Block ── */}
        <SubscriptionBlock
          api_status={subscriptionStatus}
          api_plan={subscriptionPlan}
          api_expire_date={subscriptionExpireDate}
          onSubscribe={onSubscribe}
          onManage={onManageSubscription}
        />

        {/* ── Stats Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <Card
            mode="shadow"
            style={{ borderRadius: 16, cursor: "pointer" }}
            onClick={() => setStatsPanelType("completed")}
          >
            <Div style={{ padding: "12px 14px", textAlign: "center" }}>
              <Icon20CheckCircleFillGreen style={{ color: "#22c55e", marginBottom: 4 }} />
              <Title level="3" weight="2" normalize style={{ fontSize: 20 }}>
                {completedCount}
              </Title>
              <Caption level="1" normalize style={{ color: "#818C99" }}>
                Завершено
              </Caption>
            </Div>
          </Card>

          <Card
            mode="shadow"
            style={{ borderRadius: 16, cursor: "pointer" }}
            onClick={() => setStatsPanelType("inprogress")}
          >
            <Div style={{ padding: "12px 14px", textAlign: "center" }}>
              <Icon20ClockOutline style={{ color: "#0077FF", marginBottom: 4 }} />
              <Title level="3" weight="2" normalize style={{ fontSize: 20 }}>
                {inProgressCount}
              </Title>
              <Caption level="1" normalize style={{ color: "#818C99" }}>
                В работе
              </Caption>
            </Div>
          </Card>

          <Card
            mode="shadow"
            style={{ borderRadius: 16, cursor: "pointer" }}
            onClick={() => setStatsPanelType("errors")}
          >
            <Div style={{ padding: "12px 14px", textAlign: "center" }}>
              <Icon20ErrorCircleFillRed style={{ color: "#ef4444", marginBottom: 4 }} />
              <Title level="3" weight="2" normalize style={{ fontSize: 20 }}>
                {errorCount}
              </Title>
              <Caption level="1" normalize style={{ color: "#818C99" }}>
                Ошибки
              </Caption>
            </Div>
          </Card>
        </div>

        {/* ── Live Tasks ── */}
        <Card mode="shadow" style={{ borderRadius: 20 }}>
          <Div style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: "#EEF4FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon20PlayCircle style={{ color: "#0077FF" }} />
                </div>
                <div>
                  <Title level="3" weight="2" normalize>
                    Активные задачи
                  </Title>
                  {liveTasks.length > 0 && (
                    <Caption level="1" normalize style={{ color: "#818C99", display: "block", marginTop: 1 }}>
                      {liveTasks.length} {liveTasks.length === 1 ? "задача" : liveTasks.length < 5 ? "задачи" : "задач"}
                    </Caption>
                  )}
                </div>
              </div>
              {liveTasks.length > 0 && (
                <Button mode="tertiary" size="s" onClick={onClearTasks} style={{ color: "#ef4444" }}>
                  Очистить
                </Button>
              )}
            </div>
          </Div>

          {liveTasks.length === 0 ? (
            <Div style={{ padding: "20px 16px 24px", textAlign: "center" }}>
              <Text style={{ color: "var(--vkui--color_text_secondary)" }}>
                Нет активных задач
              </Text>
              <Spacing size={12} />
              <Button mode="primary" size="m" onClick={onSwitchTab}>
                Создать задачу
              </Button>
            </Div>
          ) : (
            <div style={{ padding: "0 16px 16px" }}>
              {liveTasks.map((task) => {
                const pct = task.count > 0 ? Math.round((task.done / task.count) * 100) : 0;
                return (
                  <Card key={task.id} mode="outline" style={{ borderRadius: 14, marginBottom: 8 }}>
                    <Div style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Text weight="2" normalize style={{ display: "block" }}>
                            {task.task}
                          </Text>
                          <Caption level="1" normalize style={{ color: "#818C99", display: "block", marginTop: 2 }}>
                            {task.brand}
                          </Caption>
                        </div>
                        <Button mode="tertiary" size="s" onClick={() => onRemoveTask(task.id)}>
                          Удалить
                        </Button>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <Caption level="2" normalize style={{ color: "#818C99" }}>
                          {task.done} из {task.count}
                        </Caption>
                        <Caption level="2" weight="2" normalize style={{ color: "#0077FF" }}>
                          {pct}%
                        </Caption>
                      </div>
                      <Progress value={pct} />
                    </Div>
                  </Card>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <StatsDetailPanel
        type={statsPanelType}
        onClose={() => setStatsPanelType(null)}
        completedTasks={completedTasks}
        inProgressTasks={inProgressTasks}
        errorTasks={errorTasks}
      />
    </>
  );
}

