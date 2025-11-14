import { CalendarDaysIcon } from "@heroicons/react/24/outline";

const NoRecordsFound = () => (
  <div className="text-center py-20 bg-card/20 rounded-lg">
    <CalendarDaysIcon className="mx-auto h-16 w-16 text-muted-foreground/50" />
    <h3 className="mt-4 text-xl font-semibold text-foreground">
      No Events Found
    </h3>
    <p className="mt-1 text-muted-foreground">
      Try adjusting your search or filter criteria to find what you're looking
      for.
    </p>
  </div>
);

export default NoRecordsFound;
