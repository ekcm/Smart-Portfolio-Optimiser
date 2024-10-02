import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useFinanceNewsFilterStore } from "../../store/FinanceNewsFilterState"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "../ui/calendar";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function FinanceNewsFilter() {
    const newsName = useFinanceNewsFilterStore((state) => state.newsName);
    const newsRating = useFinanceNewsFilterStore((state) => state.newsRating);
    const newsDate = useFinanceNewsFilterStore((state) => state.newsDate);
    const setNewsName = useFinanceNewsFilterStore((state) => state.setNewsName);
    const setNewsRating = useFinanceNewsFilterStore((state) => state.setNewsRating);
    const setNewsDate = useFinanceNewsFilterStore((state) => state.setNewsDate);
    const [date, setDate] = useState<Date | null>(null as Date | null);

    const ratingLevels = {
        0: "No Filter",
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
    }

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            console.log(selectedDate);
            setDate(selectedDate);  // Set the local state
            setNewsDate(selectedDate);  // Set the Zustand store date
        } else {
            setDate(null);  // Clear the local state
            setNewsDate(null);  // Clear the Zustand store date
        }
    };

    useEffect(() => {
        if (newsDate === null) {
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
                {/* TODO: Change to select instead of input if still using this as filter */}
                <Label className="flex flex-1 flex-grow-0 basis-2/5 items-center space-x-2 whitespace-nowrap text-md gap-2">
                    News Rating:
                    <Select value={newsRating === 0 ? "" : newsRating.toString()} onValueChange={(value) => setNewsRating(Number(value))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select news rating level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {Object.entries(ratingLevels).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>
                                        {value === 0 ? "No Filter" : value}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
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