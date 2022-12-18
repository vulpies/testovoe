import Swal from "sweetalert2"

const ModalDialog = (
    text: string[],
    id: string[],
    setListName: React.Dispatch<React.SetStateAction<string[]>>,
    setListId: React.Dispatch<React.SetStateAction<string[]>>,
    allInputs: NodeListOf<HTMLInputElement>
) => {
    return Swal.fire({
        title: `Вы уверены что хотите аннулировать товар(ы):`,
        text: `${text.join(", ")}`,
        showDenyButton: true,
        confirmButtonText: "Применить",
        denyButtonText: `Отклонить`,
    }).then((result) => {
        if (result.isConfirmed) {
            fetch("/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    arrOfIds: id,
                }),
            })
            Swal.fire("Ваш выбор аннулирован!", "", "success")
            setListName([])
            setListId([])
            allInputs.forEach((item) => {
                if (item.checked === true) {
                    item.checked = false
                }
            })
        }
    })
}

export default ModalDialog
