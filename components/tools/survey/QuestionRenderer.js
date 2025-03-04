import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const findTitle = (array, id, field = null) => {
  //console.log(array, id, field);
  const item = array.find((item) => item.id === id);

  if (!item) return null; // Return null if ID not found
  if (typeof item[field] === "object") {
    return item[field]?.name || null; // Access nested key if it's an object
  }

  return item[field] || null; // Return main field if item is object
};

export default function QuestionRenderer({ question, index, itemlist }) {
  return (
    <div key={index} className="mt-4 px-4">
      <p className="text-xs text-zinc-400 font-light">Question # {index + 1}</p>
      <p className="text-sm text-indigo-700 font-bold mb-1">
        {question.question}
      </p>
      {question.type === "text" && (
        <Input placeholder="" className="bg-white mt-0" />
      )}
      {question.type === "paragraph" && (
        <Textarea placeholder="" className="bg-white mt-0" rows="3" />
      )}
      {question.type === "number" && (
        <Input placeholder="" type="number" className="bg-white mt-0" />
      )}
      {question.type === "date" && (
        <Input placeholder="" type="date" className="bg-white mt-0" />
      )}
      {question.type === "dropdown" && (
        <Select className="w-full h-9 rounded-md border text-sm px-1 border-zinc-200 text-zinc-600 active:border-zinc-200 focus:border-zinc-200">
          <SelectTrigger className="w-full font-sans">
            <SelectValue placeholder="Choose One..." />
          </SelectTrigger>
          <SelectContent className="font-sans">
            {JSON.parse(question.options).map((option, index) => (
              <SelectItem key={index} value={option.value}>
                {option.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {question.type === "radio" && (
        <RadioGroup className="pl-4">
          {JSON.parse(question.options).map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={index} />
              <Label htmlFor={index} className="font-thin">
                {option.value}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
      {question.type === "checklist" && (
        <div className="pl-4">
          {JSON.parse(question.options).map((option, index) => (
            <div key={index} className="items-top flex space-x-2 mt-2">
              <Checkbox id={index} />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={index}
                  className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.value}
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
      {question.type === "photo" && (
        <Input placeholder="" type="file" className="bg-white mt-0" />
      )}
      {question.type === "tablelist" && question.options && (
        <table className="border-2 border-gray-600 font-sans w-full text-xs">
          <thead>
            <tr>
              <th className="p-2 border text-left bg-gray-600 text-white">
                {JSON.parse(question.options)[0].reference_row}
              </th>

              {JSON.parse(question.options)[0].columns.map(
                (field, index) =>
                  field.title.length > 0 && (
                    <th
                      className="p-2 border  text-left bg-gray-600 text-white"
                      key={index}
                    >
                      {field.title}
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody>
            {JSON.parse(question.options)[0].datalist.map((item, index) => (
              <tr key={index}>
                <td className="p-2 border">
                  <p className="font-semibold text-gray-600">
                    {findTitle(
                      itemlist,
                      item.productid,
                      JSON.parse(question.options)[0].display_data[0].field
                    )}
                  </p>
                  {JSON.parse(question.options)[0].display_data.length > 1 && (
                    <p className="font-thin text-gray-600">
                      {findTitle(
                        itemlist,
                        item.productid,
                        JSON.parse(question.options)[0].display_data[1].field
                      )}
                    </p>
                  )}
                </td>
                {JSON.parse(question.options)[0].columns.map(
                  (field, index) =>
                    field.title.length > 0 && (
                      <td className="p-2 border text-xs" key={index}>
                        {field.type === "Dropdown" ? (
                          <Select>
                            <SelectTrigger className="w-full bg-white font-sans text-xs">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white font-sans">
                              {field.options.split(",").map((option, index) => (
                                <SelectItem
                                  value={option}
                                  key={index}
                                  className="text-xs"
                                >
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            type={field.type}
                            placeholder=""
                            className="bg-white text-xs"
                          />
                        )}
                      </td>
                    )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {(question.isMandatory || question.geofence) && (
        <div className="pb-8">
          {question.isMandatory && (
            <p className="float-left text-xs font-thin rounded-sm bg-zinc-400 text-zinc-100 px-2 mt-1 w-20 text-center mr-2">
              mandatory
            </p>
          )}
          {question.geofence && (
            <p className="float-left text-xs font-thin rounded-sm bg-zinc-400 text-zinc-100 px-2 mt-1 w-20 text-center">
              geo-fenced
            </p>
          )}
        </div>
      )}
    </div>
  );
}
