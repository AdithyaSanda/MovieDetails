import { useState } from "react";

export default function ShowMoreText({text, maxChars = 150, style}) {
    const [expanded, setExpanded] = useState(false)
    const isLong = text.length > maxChars

    return(
        <div>
            <p className={`review ${style}`}>
                {expanded || !isLong ? text : text.slice(0, maxChars) + `...  `}
                {isLong && (
                    <span className="review-link" onClick={() => setExpanded(!expanded)}>
                        {expanded ? "Show less" : "Show more"}
                    </span>
                )}
            </p>
        </div>
    )
}