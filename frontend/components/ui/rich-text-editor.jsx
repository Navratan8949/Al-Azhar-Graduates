"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";

// Dynamically import Jodit Editor with SSR disabled
const JoditEditor = dynamic(() => import("jodit-react"), { 
    ssr: false,
    loading: () => <div className="flex h-[300px] items-center justify-center border rounded-md bg-muted/20"><Loader2 className="animate-spin h-6 w-6 text-muted-foreground" /></div>
});

export function RichTextEditor({ value, onChange, placeholder = "Start typing..." }) {
    const config = useMemo(() => ({
        readonly: false,
        placeholder: placeholder,
        height: 400,
        enableDragAndDropFileToEditor: true,
        uploader: {
            insertImageAsBase64URI: true, // Stores image as base64 in HTML
        },
        buttons: [
            "source", "|",
            "bold", "italic", "underline", "strikethrough", "|",
            "ul", "ol", "|",
            "font", "fontsize", "brush", "paragraph", "|",
            "image", "table", "link", "|",
            "align", "undo", "redo", "hr", "eraser", "fullsize"
        ]
    }), [placeholder]);

    return (
        <div className="w-full prose-editor text-black">
            <JoditEditor
                value={value || ""}
                config={config}
                tabIndex={1}
                onBlur={newContent => onChange(newContent)}
                onChange={newContent => {}}
            />
        </div>
    );
}
