﻿"use client"

import {Moon, Sun} from "lucide-react"
import {useTheme} from "next-themes";

import {Button} from "@/components/ui/button"

export function ModeToggle() {
    const {theme, setTheme} = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    }

    return (
        <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Sun/> : <Moon/>}
        </Button>
    )
}