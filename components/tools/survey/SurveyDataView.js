import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import QuestionRenderer from "./QuestionRenderer";

export default function SurveyDataView({ open, mode, surveyid, onClose }) {
  const [surveydata, setSurveyData] = useState();
  const [itemlist, setItemList] = useState();

  useEffect(() => {
    if (surveyid) {
      const token = localStorage.getItem("token");

      fetch(
        "/api/survey/admin/getSurveyDetails?" +
          new URLSearchParams({
            id: parseInt(surveyid),
          }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setSurveyData(data);
          //console.log(data);
        });

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
    }
  }, [surveyid]);

  return (
    <div>
      {surveydata && itemlist && (
        <div>
          {/* Overlay */}
          <div
            className={cn(
              "fixed inset-0 bg-black/80 z-70 transition-opacity",
              open ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            onClick={onClose}
          />
          <aside
            className={cn(
              "fixed right-0 top-0 h-full w-1/2 max-w-1/2 bg-background z-50",
              "shadow-lg transition-transform duration-300 ease-in-out",
              "transform",
              open ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="p-6 h-full flex flex-col bg-zinc-50">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <p className="text-xl font-semibold">{surveydata[0].title}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-md font-thin text-zinc-600 -mt-8">
                {surveydata[0].description}
              </p>

              {/* Content */}
              <div className="flex-1 overflow-y-auto mt-4 px-2 pb-12 pt-4 border rounded-md bg-white">
                {/* Your sidebar content here */}

                {surveydata[0].SurveyQuestions.map((question, index) => (
                  <QuestionRenderer
                    key={index}
                    question={question}
                    index={index}
                    itemlist={itemlist}
                  />
                ))}
              </div>

              {/* Footer (optional) */}
              <div className="border-t pt-4 mt-4">
                <Button onClick={onClose} className="w-full">
                  Close
                </Button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
