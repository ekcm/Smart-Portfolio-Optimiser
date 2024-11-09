"use client";

import React, { useState } from "react";
import { addDays, format, startOfMonth, endOfMonth } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
    onGenerateReport: () => void;
}

export default function DateRangePicker({
    className,
    onGenerateReport
}: DateRangePickerProps) {
    const [date, setDate] = useState<DateRange | undefined>({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    })
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-52 justify-center font-normal bg-gray-700 text-white",
              !date && "text-muted-foreground"
            )}
          >
            Orders History
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
            <div className="flex flex-col justify-center space-y-2 mb-4">
                <Button
                    disabled
                    id="date"
                    variant={"outline"}
                    className={cn(
                        "justify-center font-normal",
                        !date && "text-muted-foreground"
                    )}
                    >
                    <CalendarIcon className="mr-2"/>
                    {date?.from ? (
                        date.to ? (
                            <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                        </>
                    ) : (
                        format(date.from, "LLL dd, y")
                        )
                    ) : (
                        <span>Pick a date</span>
                    )}
                </Button>
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                />
                <Button className="bg-green-700 m-12" onClick={onGenerateReport}>Generate Orders History Report</Button>
            </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
