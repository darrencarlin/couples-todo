import { Icon } from "@/components/icon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import {
  cn,
  isDateFuture,
  isDatePast,
  isDateToday,
  isDateWithinWeek,
} from "@/lib/utils";
import { PlanWithRelations } from "@/types";
import { format } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";

type Accumulator = {
  past: PlanWithRelations[];
  week: PlanWithRelations[];
  future: PlanWithRelations[];
};

type DateGrouping = Record<string, PlanWithRelations[]>;

const groupByMonth = (plans: PlanWithRelations[]): DateGrouping => {
  return plans.reduce<DateGrouping>((acc, plan) => {
    if (!plan.date) return acc;

    const year = format(new Date(plan.date), "yyyy");
    const month = format(new Date(plan.date), "MMM");

    const key = `${month}, ${year}`;

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(plan);

    return acc;
  }, {});
};

const getPlans = async () => {
  const session = await auth();

  if (!session?.user.id) {
    return redirect("/sign-in");
  }

  const data = await prisma.plan.findMany({
    where: {
      OR: [
        {
          userId: session.user.id,
        },
        { significantOtherId: session.user.id },
      ],
    },
    include: {
      category: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  if (!data) {
    return { past: [], week: [], future: {} };
  }

  // Group by date
  // Past (less than today)
  // Upcoming (greater than today)
  // Future (greater than 7 days) (grouped by month)

  const grouped = data.reduce<Accumulator>(
    (acc, plan) => {
      const date = new Date(plan.date);
      const currentDate = new Date();

      const isToday = isDateToday(date, currentDate);
      const isPast = isDatePast(date, currentDate);
      const isWeek = isDateWithinWeek(date, currentDate);
      const isFuture = isDateFuture(date, currentDate);

      if (isPast) {
        acc.past.push(plan);
        return acc;
      }

      if (isWeek || isToday) {
        acc.week.push(plan);
        return acc;
      }

      if (isFuture) acc.future.push(plan);

      return acc;
    },
    { past: [], week: [], future: [] as PlanWithRelations[] }
  );

  // Group future by month
  const future = groupByMonth(grouped.future);
  const past = groupByMonth(grouped.past);

  return {
    past,
    week: grouped.week,
    future,
  };
};

export default async function Plans() {
  const plans = await getPlans();

  if (!plans) return null;

  const { past, future, week } = plans;

  return (
    <main>
      <div className="flex flex-col">
        <p className="bg-zinc-50 border-b border-muted-foreground/20 px-3 py-3 font-medium">
          This Week
        </p>
        <div className="flex flex-col">
          {week.map((plan: PlanWithRelations) => {
            return <PlanCard key={plan.id} plan={plan} />;
          })}
        </div>

        <Accordion type="multiple">
          <AccordionItem value="future">
            <AccordionTrigger>Future</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col">
                {Object.entries(future).map(([month, plans]) => (
                  <Accordion type="multiple" key={month}>
                    <AccordionItem value={month}>
                      <AccordionTrigger className="bg-white font-normal">
                        {month}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col">
                          {plans.map((plan: PlanWithRelations) => {
                            return <PlanCard key={plan.id} plan={plan} />;
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="multiple">
          <AccordionItem value="past">
            <AccordionTrigger>Past</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col">
                {Object.entries(past).map(([month, plans]) => (
                  <Accordion type="multiple" key={month}>
                    <AccordionItem value={month}>
                      <AccordionTrigger className="bg-white font-normal">
                        {month}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col">
                          {plans.map((plan: PlanWithRelations) => {
                            return <PlanCard key={plan.id} plan={plan} />;
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  );
}

interface Props {
  plan: PlanWithRelations;
}

const PlanCard = ({ plan }: Props) => {
  if (!plan.date) return null;

  const classname = cn(
    "flex justify-between items-center px-3 py-3 bg-zinc-100"
  );

  const isToday = plan.date.getDate() === new Date().getDate();

  return (
    <Link href={`/plan/${plan.id}`} className={classname}>
      <div className="flex items-center gap-2">
        <div className="p-1 rounded text-xs bg-zinc-200">
          {isToday ? "Today" : format(new Date(plan.date), "do")}
        </div>
        <div>{plan.name}</div>
      </div>

      <div
        className="p-1 rounded"
        style={{ backgroundColor: plan.category?.color ?? "#6b7280" }}
      >
        <Icon icon={plan.category?.icon} />
      </div>
    </Link>
  );
};
