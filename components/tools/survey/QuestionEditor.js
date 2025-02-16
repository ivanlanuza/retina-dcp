import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Trash, Copy, CircleArrowRight } from "lucide-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function QuestionEditor({
  question,
  onChange,
  counter,
  onDelete,
}) {
  const updateQuestion = (updates) => {
    onChange({ ...question, ...updates });
  };

  return (
    <div className="border border-indigo-200 bg-white rounded-lg p-4 space-y-4">
      <div className="grid grid-cols-4 space-x-4 pb-4 pt-2">
        <div className="col-span-3">
          <p className="text-zinc-500 mb-1 text-xs font-semibold">
            Question # {counter}
          </p>
          <Input
            placeholder=""
            value={question.question}
            className="bg-white"
            onChange={(e) => updateQuestion({ question: e.target.value })}
          />
        </div>
        <div className="col-span-1">
          <p className="text-zinc-500 mb-1 text-xs font-semibold">
            Answer Type
          </p>
          <select
            value={question.type}
            className="w-full h-9 rounded-md border text-sm px-1 border-zinc-200 text-zinc-600"
            onChange={(e) => {
              updateQuestion({ type: e.target.value });
            }}
          >
            <option value="text">Short Text</option>
            <option value="paragraph">Long Text</option>
            <option value="date">Date</option>
            <option value="number">Number</option>
            <option value="dropdown">Dropdown</option>
            <option value="radio">Option Buttons</option>
            <option value="checklist">Checklist</option>
            <option value="tablelist">Master Data Reference</option>
            <option value="photo">Photo Upload</option>
          </select>
        </div>
      </div>

      {["radio", "dropdown", "checklist"].includes(question.type) && (
        <div>
          {question.options.map((option, index) => (
            <div className="relative ml-8" key={index}>
              <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
                <CircleArrowRight className="h-4 w-4" />
              </div>
              <Input
                key={index}
                value={option.value}
                onChange={(e) => {
                  const newOptions = [...question.options];
                  newOptions[index] = { key: index, value: e.target.value };
                  updateQuestion({ options: newOptions });
                }}
                className="pl-8 mb-2 active:border-indigo-600"
              />
              <div className="absolute right-2.5 top-2.5 h-4 w-4">
                <Trash
                  className="h-4 w-4 hover:text-red-600"
                  onClick={() => {
                    question.options.splice(index, 1);
                    updateQuestion();
                  }}
                />
              </div>
            </div>
          ))}

          <div
            onClick={() =>
              updateQuestion({ options: [...question.options, ""] })
            }
            className="ml-8 border  bg-indigo-50  hover:font-bold rounded-md h-10 border-dashed border-indigo-400 flex justify-center items-center hover:cursor-pointer hover:border-indigo-800"
          >
            <p className="pl-2 text-sm text-indigo-600">Add Option</p>
          </div>
        </div>
      )}

      <hr></hr>

      <div className="flex justify-end gap-8">
        <div className="border-r border-zinc-400 py-0 pr-6 text-xs flex items-center space-x-4">
          <Trash
            className="text-zinc-300 hover:text-red-500"
            onClick={() => {
              onDelete();
            }}
          />
          {/*<Copy className="text-zinc-300 hover:text-indigo-500" />*/}
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="geofence"
            checked={question.geofence}
            onCheckedChange={(checked) => updateQuestion({ geofence: checked })}
          />
          <Label
            htmlFor="status"
            className={question.geofence ? "font-semibold" : "font-thin"}
          >
            Geo Fenced
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="mandatory"
            checked={question.isMandatory}
            onCheckedChange={(checked) =>
              updateQuestion({ isMandatory: checked })
            }
          />
          <Label
            htmlFor="status"
            className={question.isMandatory ? "font-semibold" : "font-thin"}
          >
            Mandatory
          </Label>
        </div>
      </div>
    </div>
  );
}
