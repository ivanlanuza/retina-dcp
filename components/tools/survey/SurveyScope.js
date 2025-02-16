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

export default function SurveyScope({ onChangeScope }) {
  return (
    <div>
      <p className="font-bold text-md">Survey Scope</p>
      <div>
        <p className="text-xs font-bold mt-8 mb-1">Accept Responses from:</p>
        <Select
          onValueChange={onChangeScope}
          className="w-full h-9 rounded-md border text-sm px-1 border-zinc-200 text-zinc-600 active:border-zinc-200 focus:border-zinc-200"
        >
          <SelectTrigger className="w-full font-sans">
            <SelectValue placeholder="All users" />
          </SelectTrigger>
          <SelectContent className="font-sans">
            <SelectItem value="all">All users</SelectItem>
            <SelectItem value="teams">Specific Teams</SelectItem>
            <SelectItem value="roles">Specific Roles</SelectItem>
            <SelectItem value="users">Specific Users</SelectItem>
            <SelectItem value="clientaccounts">
              Specific Client Accounts
            </SelectItem>
            <SelectItem value="locations">Specific Locations</SelectItem>
            <SelectItem value="agencies">Specific Agencies</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
