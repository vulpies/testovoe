import { document1, document2 } from "../mocks/fakeData"
import { useState } from "react"
import ModalDialog from "./modalDialog"

const MainComponent = () => {
    const [searchValue, setSearchValue] = useState("")
    const commonData = [...document1.concat(document2)]
    commonData.sort(byField("delivery_date"))

    const allInputs = document.querySelectorAll(
        ".main__table input"
    ) as NodeListOf<HTMLInputElement>

    const [filteredData, setFileteredData] = useState(commonData)

    const listIdArr: string[] = []
    const listNamesArr: string[] = []

    const [listName, setListName] = useState<string[]>([])
    const [listId, setListId] = useState<string[]>([])

    const [isChecked, setChecked] = useState<boolean>(false)

    let commonQty: number = 0
    commonData.map((item) => (commonQty += item.qty))

    let commonVolume: number = 0
    commonData.map((item) => (commonVolume += item.volume))

    function byField(field: string) {
        return (a: any, b: any) => (a[field] > b[field] ? 1 : -1)
    }

    function createItemsList(
        arr: string[],
        value: string,
        setParam: React.Dispatch<React.SetStateAction<string[]>>
    ) {
        arr.push(value)

        setParam((prev: any) => {
            return prev.concat(arr)
        })
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { id, value, checked } = e.target

        if (checked && isChecked === false) {
            createItemsList(listIdArr, id, setListId)
            createItemsList(listNamesArr, value, setListName)
        } else {
            setListName(listName.filter((item) => item !== value))
            setListId(listId.filter((item) => Number(item) !== Number(id)))
            setChecked(false)
        }
    }

    function handleCheckAll() {
        setChecked(true)
        allInputs.forEach((item) => {
            if (item.checked === false) {
                item.checked = true

                const itemId = commonData.find(
                    (e) => Number(e.id) === Number(item.id)
                )
                const itemName = commonData.find((e) => e.name === item.value)

                if (
                    !listNamesArr.find((item) => item === itemName!.name) &&
                    !listIdArr.find((item) => item === itemId!.id)
                ) {
                    listIdArr.push(itemId!.id)
                    listNamesArr.push(itemName!.name)
                }
            }
        })
        setListId((prev: any) => {
            return prev.concat(listIdArr)
        })
        setListName((prev: any) => {
            return prev.concat(listNamesArr)
        })
    }

    function handleSearch() {
        setFileteredData(
            commonData.filter((item) => {
                let key: keyof typeof item
                for (key in item) {
                    if (key === "id") {
                        continue
                    } else if (
                        item[key].toString().toLowerCase() ===
                        searchValue.trim()
                    ) {
                        return true
                    }
                }
                return false
            })
        )
    }

    function cancelSearch() {
        setFileteredData(commonData)
    }

    return (
        <div className="main__wrapper">
            <div className="main__table-wrapper">
                <div className="main__table color">
                    <p>Название</p>
                    <p>Кол-во</p>
                    <p>Статус</p>
                    <p>Объем (см)</p>
                    <p>Дата получения</p>
                    <p>Стоимость</p>
                    <p>Валюта</p>
                    <p>Всего</p>
                    <p className="checkbox" onClick={handleCheckAll}>
                        Выбрать все
                    </p>
                </div>
                {filteredData.map((item) => (
                    <div className="main__table" key={Number(item.id)}>
                        <p>{item.name}</p>
                        <p>{item.qty}</p>
                        <p>{item.status}</p>
                        <p>{item.volume}</p>
                        <p>{item.delivery_date}</p>
                        <p>{item.sum}</p>
                        <p>{item.currency}</p>
                        <p>{item.qty * item.sum + " " + item.currency}</p>
                        <p>
                            <input
                                type="checkbox"
                                className="main__checkbox"
                                id={item.id}
                                value={item.name}
                                onChange={(e) => handleChange(e)}
                            />
                        </p>
                    </div>
                ))}
                <div className="main__statistics">
                    <p>
                        Общий объем: <span>{commonVolume}</span>
                    </p>
                    <p>
                        Общее количество: <span>{commonQty}</span>
                    </p>

                    <button
                        className="main__btn"
                        onClick={() =>
                            ModalDialog(
                                listName,
                                listId,
                                setListName,
                                setListId,
                                allInputs
                            )
                        }
                    >
                        Аннулировать
                    </button>
                </div>
            </div>
            <div className="main__search">
                <input
                    type="text"
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="введите полное искомое значение..."
                />

                <button onClick={() => handleSearch()}>Искать</button>
                <button onClick={() => cancelSearch()}>Отмена</button>
            </div>
        </div>
    )
}

export default MainComponent
