import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SurveyOptions({
  form,
  onChangeUsage,
  onChangeFromDate,
  onChangeUntilDate,
  onChangeStatus,
}) {
  return (
    <div>
      <p className="font-bold text-md">Survey Options</p>
      <div>
        <p className="text-xs font-bold mt-8 mb-1">Status:</p>
        <Select
          onValueChange={onChangeStatus}
          className="w-full h-9 rounded-md border text-sm px-1 border-zinc-200 text-zinc-600 active:border-zinc-200 focus:border-zinc-200"
        >
          <SelectTrigger className="w-full font-sans">
            <SelectValue placeholder="Open for Responses" />
          </SelectTrigger>
          <SelectContent className="font-sans">
            <SelectItem value="open">Open for Responses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <p className="text-xs font-bold mt-8 mb-1">Open From:</p>
        <Input
          placeholder=""
          type="date"
          className="bg-white mt-0"
          onChange={onChangeFromDate}
        />
      </div>
      <div>
        <p className="text-xs font-bold mt-8 mb-1">Open Until:</p>
        <Input
          placeholder=""
          type="date"
          className="bg-white mt-0"
          onChange={onChangeUntilDate}
        />
      </div>
      <div className="flex items-center space-x-2 mt-8 mb-1">
        <Switch
          id="singleuse"
          checked={form.allowMultiple}
          onCheckedChange={onChangeUsage}
          //onCheckedChange={(checked) => updateQuestion({ geofence: checked })}
        />
        <Label
          htmlFor="singleuse"
          className={form.allowMultiple ? "font-semibold" : "font-thin"}
        >
          {form.allowMultiple
            ? "Survery can be answered multiple times by the same user"
            : "Survey can only be answered one-time per user"}
        </Label>
      </div>
    </div>
  );
}
