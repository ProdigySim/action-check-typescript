import { ErrorTs, ProcessedProject } from "./main"

const BLANK_LINE = '  \n'

type ProjectInput = {
    errorsInProjectBefore: ErrorTs[]
    errorsInProjectAfter: ErrorTs[]
    newErrorsInProject: ErrorTs[]
    errorsInModifiedFiles: ErrorTs[]
    newErrorsInModifiedFiles: ErrorTs[]
    project: ProcessedProject;
}


export function getBodyComment(inputs: ProjectInput[]): string {
    return [
        '## TypeScript Errors Check',
        BLANK_LINE,
        inputs.map(getBodyCommentForProject).join(BLANK_LINE)
    ].join('')
}
export function getBodyCommentForProject(
    { 
        errorsInProjectBefore,
        errorsInProjectAfter,
        errorsInModifiedFiles,
        newErrorsInProject,
        project, 
    }: ProjectInput,
): string {

    const delta = errorsInProjectAfter.length - errorsInProjectBefore.length
    let s = `### ${project.name}  \n`

    const areStillErrors = !!errorsInProjectAfter.length

    if (areStillErrors) {
        if (delta < 0) {
            s += BLANK_LINE
            s += `Yeah, you have removed ${-delta} errors with this PR 👏  \n`
            s += BLANK_LINE
        } else if (delta > 0) {
            s += BLANK_LINE
            s += `Ohhh you have added ${delta} errors whith this PR 😥  \n`
            s += BLANK_LINE
        }
        s += `**${errorsInProjectAfter.length} ts error${errorsInProjectAfter.length === 1 ? '' : 's'} detected in all the codebase 😟.**  \n`
        s += BLANK_LINE
        s += BLANK_LINE
    }

    if (!areStillErrors) {
        s += `No ts errors in the project ! 🎉  \n`
        s += BLANK_LINE
        if (delta < 0) {
            s += `Congrats, you have removed ${-delta} ts error${-delta === 1 ? '' : 's'} with this PR 💪  \n`
            s += BLANK_LINE
        }
        return s
    }

    if (!errorsInModifiedFiles.length) {
        s += `Well done: no ts errors in files changed in this PR! 🎉 \n`
        s += BLANK_LINE
    } else {
        s += `**${errorsInModifiedFiles.length} ts error${errorsInModifiedFiles.length === 1 ? '' : 's'} detected in the modified files.**  \n`
        s += BLANK_LINE
        // Limit modified file errors to max length 100
        s += getListOfErrors(`Details`, errorsInModifiedFiles, 100)
        s += BLANK_LINE
    }

    if (newErrorsInProject.length > 0) {
        s += BLANK_LINE
        s += `**${newErrorsInProject.length} new error${newErrorsInProject.length > 1 ? 's' : ''} added** \n`
        s += `*Note : in some rare cases, new errors can be existing errors but with different locations*`
        s += BLANK_LINE
        s += getListOfErrors(`Details`, newErrorsInProject)
        s += BLANK_LINE
    }

    console.info(
        `Body Comment Length: ${s.length}`,
        `Mod Errors: ${errorsInModifiedFiles.length}`,
        `New Errors: ${newErrorsInProject.length}`
    )

    return s
}

function getListOfErrors(title: string, errors: ErrorTs[],  maxErrorLength = Infinity, thresholdCollapse = 5): string {
    const shouldUseCollapsible = errors.length > thresholdCollapse
    let s = ``

    if (shouldUseCollapsible) {
        s += `<details><summary>${title} </summary>  \n`
        s += BLANK_LINE
        s += BLANK_LINE
    } else {
        s += BLANK_LINE
    }

    s += `\nFilename|Location|Message\n`
    s += `-- | -- | -- \n`
    s += errors.map(err => {
        const message = escapeForMarkdown(shortenMessage(err.message, maxErrorLength))
        return `${err.fileName}|${err.line}, ${err.column}|${message}`
    }).join('\n')


    if (shouldUseCollapsible) {
        s += BLANK_LINE
        s += `</details>  \n`
    }

    return s
}
/**
 * Try to intelligently shorten TS error messages.
 * Captures quoted types and shortens them to 100 characters.
 * @param s TS Error message
 * @returns shortened error message
 */
export function shortenMessage(s: string, maxLength = Infinity): string{
    const trimmedStr = s.replace(/'(.*?)'($|[\s.,])/g, (match, p1: string, p2: string) => {
        if(p1.length > 50) {
            return `'${p1.substring(0, 47)}...'${p2}`
        }
        return `'${p1}'${p2}`
    })
    if(trimmedStr.length > maxLength) {
        return `${trimmedStr.substring(0, maxLength-3)}...`
    }
    return trimmedStr
}

export function escapeForMarkdown(s: string): string {
    return s.replace(/\|/g, '\\|')
}