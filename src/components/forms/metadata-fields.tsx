import { cn } from "@/lib/utils";
import { Check, DollarSign, MapPin, Text, Users } from "lucide-react";
import { Button } from "../ui/button";
import { FormLabel } from "../ui/form";
import { Label } from "../ui/label";

interface Field {
  title:
    | "Name"
    | "Description"
    | "Date"
    | "Location"
    | "People"
    | "Budget"
    | "Comments";
  name:
    | "name"
    | "description"
    | "date"
    | "location"
    | "people"
    | "budget"
    | "comments";
  icon: any;
}

export type Fields = Field[];

const FIELDS: Fields = [
  {
    title: "Description",
    name: "description",
    icon: Text,
  },
  {
    title: "Location",
    name: "location",
    icon: MapPin,
  },
  {
    title: "People",
    name: "people",
    icon: Users,
  },
  {
    title: "Budget",
    name: "budget",
    icon: DollarSign,
  },
  {
    title: "Comments",
    name: "comments",
    icon: Text,
  },
];

interface Props {
  fields: string[];
  setFields: (fields: string[]) => void;
}

export const MetadataFields = ({ fields, setFields }: Props) => {
  const toggleField = (fieldToToggle: Field) => {
    const isFieldSelected = fields.some(
      (selectedField) => selectedField === fieldToToggle.name
    );

    if (isFieldSelected) {
      setFields(fields.filter((field) => field !== fieldToToggle.name));
    } else {
      setFields([...fields, fieldToToggle.name]);
    }
  };

  return (
    <div>
      <FormLabel className="font-semibold">Fields</FormLabel>
      <div className="grid grid-cols-2 gap-2 mt-1">
        {FIELDS.map((field) => {
          const isFieldSelected = fields.some(
            (selectedField) => selectedField === field.name
          );

          const classname = cn(
            "border-0 p-4-full text-xs font-bold flex items-center tranisition-all duration-100",
            {
              "border-1": isFieldSelected,
            }
          );

          return (
            <Button
              variant={isFieldSelected ? "default" : "secondary"}
              type="button"
              className={classname}
              key={field.name}
              onClick={() => toggleField(field)}
            >
              {isFieldSelected ? <Check /> : <field.icon size={16} />}{" "}
              {field.title}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
