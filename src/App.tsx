import { ChangeEvent, useEffect, useState } from 'react'

import * as C from './App.styles'
import LogoImage from './assets/devmemory_logo.png'
import RestartIcon from './svgs/restart.svg'
import { InfoItem } from './components/InfoItem'
import { Button } from './components/Button'
import { GridItemType } from './types/GridItemType'
import { items } from './data/items'
import { GridItem } from './components/GridItem'
import { formatTimeElapsed } from './helpers/formatTimeElapsed'

function App() {

  const [playing, setPlaying] = useState<boolean>(false)
  const [timeElapsed, setTimeElapsed] = useState<number>(0)
  const [moveCount, setMoverCount] = useState<number>(0)
  const [showCount, setShowCount] = useState<number>(0)
  const [gridItems, setGridItems] = useState<GridItemType[]>([])

  useEffect(()=> resetAndCreateGrid(), [])

  useEffect(()=>{
    const timer = setInterval(()=>{
      if(playing) setTimeElapsed(timeElapsed + 1)
    },1000)
    return () => clearInterval(timer)
  }, [playing, timeElapsed])

  useEffect(()=>{
    if(showCount === 2){
      let opened = gridItems.filter(item => item.show === true)
      if(opened.length === 2){

        //v1 - se eles são iguais, torna-los permanentes
        
        if(opened[0].item === opened[1].item){
          let tmpGrid = [...gridItems]
          for(let i in tmpGrid){
            if(tmpGrid[i].show){
              tmpGrid[i].permanentShow = true
              tmpGrid[i].show = false
            }
          }
          setGridItems(tmpGrid)
          setShowCount(0)
        } else{
          setTimeout(() => {
            let tmpGrid = [...gridItems]
          //v2 = se eles não forem iguais feche eles
            for(let i in tmpGrid){
            tmpGrid[i].show = false
            }
            setGridItems(tmpGrid)
            setShowCount(0)
          }, 1000);
          
        }
       

        setMoverCount(moveCount => moveCount + 1)
      }
    }

    //verificar se os abertos são iguais
  },[showCount, gridItems])

  useEffect(()=>{
    if(moveCount > 0 && gridItems.every(item => item.permanentShow === true))
    setPlaying(false)
    //verifica se o jogo acabou
  }, [moveCount, gridItems])

  const resetAndCreateGrid = () => {
    //passo 1 resetar o jogo
    setTimeElapsed(0)
    setMoverCount(0)
    setShowCount(0)

    //passo 2 criar o grid
    //2.1 - criar um grid vazio
    let tmpGrid: GridItemType[] = []
    for(let i = 0; i < (items.length * 2); i++) tmpGrid.push({
        item: null, show: false, permanentShow: false
      })
    //2.2 - preencher o grid
      for(let w = 0; w < 2; w++){
        for(let i = 0; i <items.length; i++){
          let pos = -1
          while(pos < 0 || tmpGrid[pos].item !== null){
          pos = Math.floor(Math.random() * (items.length * 2))
          }
          tmpGrid[pos].item = i
        }
      }
    //2.3 - jogar no state
      setGridItems(tmpGrid)
    //passo 3 começar o jogo
    setPlaying(true)
  }

  const handleItemClick = (index: number) =>{
    if(playing && index !== null && showCount < 2){
      let tmpGrid = [...gridItems]

      if(tmpGrid[index].permanentShow === false && tmpGrid[index].show === false){
        tmpGrid[index].show = true
        setShowCount(showCount + 1)
      }
      setGridItems(tmpGrid)
    }
  }
 
  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={LogoImage} width={200} alt="" />
        </C.LogoLink>

        <C.InfoArea>
         <InfoItem label='Tempo' value={formatTimeElapsed(timeElapsed)}/>
         <InfoItem label='Movimentos' value={moveCount.toString()}/>
        </C.InfoArea>

        <Button label='Reiniciar' icon={RestartIcon} onClick={resetAndCreateGrid}/>
      </C.Info>
      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index)=>(
            <GridItem 
            key={index} 
            item={item}
            onClick={()=> handleItemClick(index)}
            />
          ))}

        </C.Grid>
      </C.GridArea>
    </C.Container>
  )
}

export default App
