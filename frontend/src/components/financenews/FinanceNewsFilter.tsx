import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useFinanceNewsFilterStore } from "../../../store/FinanceNewsFilterState"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "../ui/calendar";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function FinanceNewsFilter() {
    const newsName = useFinanceNewsFilterStore((state) => state.newsName);
    const newsSource = useFinanceNewsFilterStore((state) => state.newsSource);
    const newsDate = useFinanceNewsFilterStore((state) => state.newsDate);
    const setNewsName = useFinanceNewsFilterStore((state) => state.setNewsName);
    const setNewsSource = useFinanceNewsFilterStore((state) => state.setNewsSource);
    const setNewsDate = useFinanceNewsFilterStore((state) => state.setNewsDate);
    const [date, setDate] = useState<Date | null>(null as Date | null);

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDate(selectedDate);
            const formattedDate = format(selectedDate, "yyyy-MM-dd");
            setNewsDate(formattedDate);
        } else {
            setNewsDate("");
        }
    };

    useEffect(() => {
        if (newsDate === "") {
            setDate(null);
        }
    }, [newsDate]);

    return (
        <div className="flex items-center justify-center">
            <div className="flex w-full space-x-4">
                <Label className="flex flex-1 flex-grow-0 basis-3/5 items-center space-x-2 whitespace-nowrap text-md gap-1">
                    Finance Name:
                    <Input
                        type="text"
                        value={newsName}
                        onChange={(e) => setNewsName(e.target.value)}
                        className="flex-grow"
                    />
                </Label>
                <Label className="flex flex-1 flex-grow-0 basis-2/5 items-center space-x-2 whitespace-nowrap text-md gap-2">
                    News Source:
                    <Input
                        type="text"
                        value={newsSource}
                        onChange={(e) => setNewsSource(e.target.value)}
                        className="flex-grow"
                    />
                </Label>
                <Label className="flex flex-1 flex-grow-0 basis-auto items-center space-x-2 whitespace-nowrap text-md gap-2">
                    News Date:
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date || undefined}
                                onSelect={handleDateSelect}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </Label>
            </div>
        </div>
    )
}