import { Icon } from "@/components/icon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { cn } from "@/lib/utils";
import { PlanWithRelations } from "@/types";
import { format } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";

const getPlans = async () => {
  const session = await auth();

  if (!session?.user.id) {
    return redirect("/sign-in");
  }

  const data = await prisma.plan.findMany({
    where: {
      userId: session.user.id,
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

  const grouped = data.reduce(
    (
      acc: {
        past: PlanWithRelations[];
        week: PlanWithRelations[];
        future: PlanWithRelations[];
      },
      plan
    ) => {
      const date = new Date(plan.date);
      const currentDate = new Date();

      const isToday = date.getDate() === currentDate.getDate();
      const isPast = date < currentDate && !isToday;
      const isWeek =
        date > currentDate &&
        date < new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      const isFuture =
        date > new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);

      if (isPast) acc.past.push(plan);
      if (isWeek || isToday) acc.week.push(plan);
      if (isFuture) acc.future.push(plan);

      return acc;
    },
    { past: [], week: [], future: [] }
  );

  // Group future by month
  const future = grouped.future.reduce(
    (
      acc: {
        [key: string]: PlanWithRelations[];
      },
      plan
    ) => {
      if (!plan.date) return acc;
      const date = new Date(plan.date);
      const month = format(date, "MMMM");

      if (!acc[month]) {
        acc[month] = [];
      }

      acc[month].push(plan);

      return acc;
    },
    {}
  );

  return {
    past: grouped.past,
    week: grouped.week,
    future,
  };
};

export default async function Plans() {
  const plans = await getPlans();

  if (!plans) {
    return null;
  }

  const {
    past,
    week,
    future,
  }: {
    past: PlanWithRelations[];
    week: PlanWithRelations[];
    future: { [key: string]: PlanWithRelations[] };
  } = plans;

  return (
    <main>
      <div className="flex flex-col">
        {/* <Accordion type="multiple">
          <AccordionItem value="week">
            <AccordionTrigger>This Week</AccordionTrigger>
            <AccordionContent>
             
            </AccordionContent>
          </AccordionItem>
        </Accordion> */}

        <p className="bg-zinc-50 border-b border-muted-foreground/20 px-3 py-3 text-sm font-medium">
          This Week
        </p>
        <div className="flex flex-col">
          {week.map((plan) => {
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
                          {plans.map((plan) => {
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
                {past.map((plan) => {
                  return <PlanCard key={plan.id} plan={plan} />;
                })}
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
    "flex justify-between items-center text-white px-3 py-3 text-sm"
  );

  const isToday = plan.date.getDate() === new Date().getDate();

  return (
    <Link
      href={`/plan/${plan.id}`}
      className={classname}
      style={{ backgroundColor: plan.category?.color ?? "#6b7280" }}
    >
      <div className="flex gap-2">
        <span className="font-medium">
          {isToday ? "Today" : format(new Date(plan.date), "do")}
        </span>
        <span>{plan.name}</span>
      </div>

      <Icon icon={plan.category?.icon} />
    </Link>
  );
};
