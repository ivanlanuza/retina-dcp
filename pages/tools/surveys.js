import Layout from "@/components/core/Layout";
import QuestionEditor from "@/components/tools/survey/QuestionEditor";
import withAuth from "@/components/core/Auth";
import QuestionPreview from "@/components/tools/survey/QuestionPreview";
import SurveyOptions from "@/components/tools/survey/SurveyOptions";
import SurveyScope from "@/components/tools/survey/SurveyScope";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, CircleArrowLeft } from "lucide-react";

const App = () => {
  const router = useRouter();
  const [screen, setScreen] = useState("create");
  const [form, setForm] = useState({
    title: "",
    description: "",
    allowMultiple: false,
    openfrom: null,
    openuntil: null,
    status: "open",
    scopetype: "all",
    questionlist: [],
  });
  const [questions, setQuestions] = useState([]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now().toString(),
        sortOrder: questions.length + 1,
        isMandatory: false,
        geofence: false,
        type: "text",
        options: [],
      },
    ]);
  };

  const handleSaveForm = async () => {
    console.log(questions);
    console.log(form);
    /*
    const response = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, questions }),
    });
    const data = await response.json();
    router.push(`/forms/${data.id}`);
    */
  };

  const goToReview = () => {
    setScreen("review");
    console.log(questions);
  };

  const backToCreate = () => {
    setScreen("create");
  };

  const goToSettings = () => {
    setScreen("settings");
  };

  return (
    <Layout>
      {screen === "create" && (
        <div className="max-w-4xl mx-auto p-6 font-sans">
          <h1 className="text-2xl font-bold mb-6">Create New Survey</h1>

          <div className="space-y-6">
            <div className="border px-6 pt-8 pb-10 border-indigo-200 rounded-md bg-white space-y-6 mb-16">
              <div>
                <p className="text-zinc-500 mb-1 text-xs font-semibold">
                  Survey Title
                </p>
                <Input
                  placeholder=""
                  value={form.title}
                  className=""
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <p className="text-zinc-500 mb-1 text-xs font-semibold">
                  Description
                </p>
                <Textarea
                  placeholder=""
                  value={form.description}
                  className="bg-white mt-0"
                  rows="3"
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
            </div>

            {questions.map((question, index) => (
              <QuestionEditor
                key={question.id}
                counter={index + 1}
                question={question}
                onChange={(updatedQuestion) => {
                  const newQuestions = [...questions];
                  newQuestions[index] = updatedQuestion;
                  setQuestions(newQuestions);
                }}
                onDelete={() => {
                  const reducedQuestions = [...questions];
                  reducedQuestions.splice(index, 1);
                  setQuestions(reducedQuestions);
                }}
              />
            ))}

            {form.title.length > 2 && (
              <div
                onClick={handleAddQuestion}
                className="border  bg-indigo-50  hover:font-bold rounded-md h-20   border-dashed border-indigo-400 flex justify-center items-center hover:cursor-pointer hover:border-indigo-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-circle-plus"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8" />
                  <path d="M12 8v8" />
                </svg>
                <p className="pl-2 text-sm text-indigo-600">Add Question</p>
              </div>
            )}

            {questions.length > 0 && (
              <div className="flex justify-end">
                <Button onClick={() => goToReview()}>
                  <Save className="mr-2 h-4 w-4" /> Preview Survey
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      {screen === "review" && (
        <div className="max-w-4xl mx-auto p-6 font-sans">
          <h1 className="text-2xl font-bold mb-6">Preview Survey</h1>

          <div className="border px-6 pt-8 pb-10 border-indigo-200 rounded-md bg-white space-y-6 mb-4">
            <p className="text-2xl font-bold text-zinc-800 -mb-6">
              {form.title}
            </p>
            <p className="text-md font-thin text-zinc-600">
              {form.description}
            </p>
            {questions.map((question, index) => (
              <QuestionPreview key={index} question={question} index={index} />
            ))}
          </div>
          <div className="flex justify-end gap-4">
            <Button onClick={() => backToCreate()} variant="outline">
              <CircleArrowLeft className="mr-2 h-4 w-4" /> Back to Questions
            </Button>
            <Button onClick={() => goToSettings()}>
              <Save className="mr-2 h-4 w-4" /> Choose Settings
            </Button>
          </div>
        </div>
      )}
      {screen === "settings" && (
        <div className="max-w-4xl mx-auto p-6 font-sans">
          <h1 className="text-2xl font-bold mb-6">Choose Survey Settings</h1>

          <div className="border px-6 pt-8 pb-10 border-indigo-200 rounded-md bg-white space-y-6 mb-4">
            <SurveyOptions
              form={form}
              onChangeUsage={() =>
                setForm({ ...form, allowMultiple: !form.allowMultiple })
              }
              onChangeFromDate={(e) =>
                setForm({ ...form, openfrom: e.target.value })
              }
              onChangeUntilDate={(e) =>
                setForm({ ...form, openuntil: e.target.value })
              }
              onChangeStatus={(e) => setForm({ ...form, status: e })}
            />
          </div>
          <div className="border px-6 pt-8 pb-10 border-indigo-200 rounded-md bg-white space-y-6 mb-4">
            <SurveyScope
              form={form}
              onChangeScope={(e) => setForm({ ...form, scopetype: e })}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button onClick={() => goToReview()} variant="outline">
              <CircleArrowLeft className="mr-2 h-4 w-4" /> Back to Survey Review
            </Button>
            <Button onClick={() => handleSaveForm()}>
              <Save className="mr-2 h-4 w-4" /> Save & Publish Survey
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default withAuth(App);

/*
function QuestionEditor({ question, onChange, counter }) {
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
            <option value="table">Master Data Reference</option>
            <option value="photo">Photo Upload</option>
          </select>
        </div>
      </div>

      {["radio", "dropdown", "checklist"].includes(question.type) && (
        <div>
          {question.options.map((option, index) => (
            <div className="relative ml-8">
              <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
                <CircleArrowRight className="h-4 w-4" />
              </div>
              <Input
                key={index}
                value={option}
                onChange={(e) => {
                  const newOptions = [...question.options];
                  newOptions[index] = e.target.value;
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
              alert(question.id);
              updateQuestion();
            }}
          />
          <Copy className="text-zinc-300 hover:text-indigo-500" />
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
*/
