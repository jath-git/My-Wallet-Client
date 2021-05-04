/* show instructions and freeze the rest of the page when mouse hovers information 
icon at bottom right, or hide instruction when mouse does not hover */

const information = document.getElementById('information');
const visibleImage = document.querySelectorAll('.visible-image');

export function showHideInstructions() {
    information.addEventListener('mouseover', () => {
        visibleImage.forEach(img => {
            img.style.display = 'inline-block';
        })
    })

    information.addEventListener('mouseout', () => {
        visibleImage.forEach(img => {
            img.style.display = 'none';
        })
    })
}