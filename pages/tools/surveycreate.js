import Layout from "@/components/core/Layout";
import QuestionEditor from "@/components/tools/survey/QuestionEditor";
import withAuth from "@/components/core/Auth";
import QuestionPreview from "@/components/tools/survey/QuestionPreview";
import SurveyOptions from "@/components/tools/survey/SurveyOptions";
import SurveyScope from "@/components/tools/survey/SurveyScope";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, CircleArrowLeft } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const App = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [screen, setScreen] = useState("create");
  const [form, setForm] = useState({
    title: "",
    description: "",
    allowMultiple: false,
    openFrom: null,
    openUntil: null,
    status: "open",
    scopeType: "all",
    scopeList: [],
  });
  const [questions, setQuestions] = useState([]);
  const [itemlist, setItemList] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/masterdata/products/getProducts", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setItemList(data);
      });
  }, []);

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
    const token = localStorage.getItem("token");
    let datapass = JSON.stringify({
      survey: form,
      questions: questions,
    });

    const response = await fetch("/api/survey/admin/create", {
      body: datapass,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
    });

    if (response.ok) {
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      router.push("/tools/surveys");
    }, 100);
  };

  const goToReview = () => {
    setScreen("review");
    //console.log("review", questions);
  };

  const backToCreate = () => {
    setScreen("create");
    //console.log("back to create", questions);
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
              <QuestionPreview
                key={index}
                question={question}
                index={index}
                itemlist={itemlist}
              />
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
                setForm({ ...form, openFrom: e.target.value })
              }
              onChangeUntilDate={(e) =>
                setForm({ ...form, openUntil: e.target.value })
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

      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="font-sans">
          <DialogHeader>
            <DialogTitle>Success! 🎉</DialogTitle>
            <DialogDescription>
              Your survey has been created successfully!
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Survey created successfully!</p>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default withAuth(App);
