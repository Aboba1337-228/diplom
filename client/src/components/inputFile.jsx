export const InputFile = ({ file, setFile, handleClick, idInput }) => {
    return (
        <>
            <input id={idInput} type="file" onChange={e => setFile(e.target.files[0])} />
            <label htmlFor={idInput} className="flex gap-5 items-start">
                <div className="bg-white text-blue-950 py-4 px-5 rounded-3xl w-full sm:w-[370px]">{file ? file.name : 'Файл не выбран'}</div>
                <button className="bg-white text-black" onClick={() => handleClick(idInput)}>выбрать файл</button>
            </label>
        </>
    )
}