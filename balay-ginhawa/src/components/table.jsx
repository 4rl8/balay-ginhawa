export default function Table({ headers, rows }) {
    return (
        <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-md mt-4 text-center">
            <thead className="bg-white">
                <tr>
                    {headers.map((header, index) => (
                        <th key={index} className="border px-4 py-2 font-semibold">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="border px-4 py-2">{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}