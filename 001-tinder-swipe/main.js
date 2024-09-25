const DECISION_THRESHOLD = 75

let isAnimating = false
let pullDeltaX = 0

function startDrag (e) {
    if (isAnimating) return

    const actualCard = e.target.closest('article')
    if (!actualCard) return

    const startX = e.pageX ?? e.touches[0].pageX 

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onEnd)

    document.addEventListener('touchmove', onMove, { passive: true })
    document.addEventListener('touchend', onEnd, { passive: true })

    function onMove (e) {
        const currentX = e.pageX ?? e.touches[0].pageX
        pullDeltaX = currentX - startX

        if (pullDeltaX === 0) return

        isAnimating = true
        const deg = pullDeltaX / 10

        actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`
        actualCard.style.cursor = 'grabbing'

        const opacity = Math.abs(pullDeltaX) / 100
        const isRight = pullDeltaX > 0
        
        const choiseEl = isRight
            ? actualCard.querySelector('.choice.like')
            : actualCard.querySelector('.choice.nope')

        choiseEl.style.opacity = opacity
    }

    function onEnd (e) {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onEnd)

        document.removeEventListener('touchmove', onMove)
        document.removeEventListener('touchend', onEnd)

        const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD

        if (decisionMade) {
            const goRight = pullDeltaX > 0

            actualCard.classList.add(goRight ? 'go-right' : 'go-left')
            actualCard.addEventListener('transitionend', () => {
                actualCard.remove()
            }, { once: true })
        } else {
            actualCard.classList.add('reset')
            actualCard.classList.remove('go-left', 'go-right')
        }

        actualCard.addEventListener('transitionend', () => {
            actualCard.removeAttribute('style')
            actualCard.classList.remove('reset')

            pullDeltaX = 0
            isAnimating = false
        })

        actualCard
            .querySelectorAll('.choice')
            .forEach(el => el.style.opacity = 0)
    }
}

document.addEventListener('mousedown', startDrag)
document.addEventListener('touchstart', startDrag, { passive: true })
