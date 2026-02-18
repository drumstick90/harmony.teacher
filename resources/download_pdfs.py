#!/usr/bin/env python3
"""Download all PDFs from learnmusictheory.net via Wayback Machine."""

import os
import requests
import time
from urllib.parse import unquote

OUTPUT_DIR = "downloaded_pdfs"

PDF_URLS = [
    "https://learnmusictheory.net/PDFs/pdffiles/01-01-00-WhatIsHighYield.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-01-01-StavesAndClefs.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-01-02-TheChromaticScale.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-01-03-AllAboutOctaves.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-01-04-RhythmicValues.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-01-05-TimeSignaturesSimple.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-01-06-CompoundAsymmetric.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-01-07-TupletsGrouplets.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-01-08-RepeatSigns.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-01-09-DynamicsArticulations.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-01-10-SummaryofNotation.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-02-01-MajorScales.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-02-02-TheCircleofFifths.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-02-03-MajorKeySignatures.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-02-04-MinorScales.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-02-05-KeySignaturesSelfStudyTips.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-02-06-ScaleDegreeNames.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-02-07-ScalesforPiano.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-02-PianoKeyboardDiagram.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-03-01-IntroductionToIntervals.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-03-02-MasteringIntervals1.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-03-03-MasteringIntervals2.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-03-04-Transposition.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-03-TheChromaticScale.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-04-01-IntroducingTriads.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-04-02-TheMajorTriadsSpellThemQuickly.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-04-03-SpellingTriadsInFourSteps.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-04-04-SeventhChords.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-04-05-CommonChordReferenceChart.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-04-06-BasicLeadSheetSymbols.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-05-01-TextureInMusic.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-05-02-RomanNumerals.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-05-03-HarmonicProgression.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-05-04-HarmonicAnalysis1HomophonicTexture.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-05-05-NonchordTones1.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-05-06-NonchordTones2Suspensions.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-05-07-SecondInversionTriads.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-05-08-HarmonicAnalysis2PolyphonicTexture.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-13-Intervals2.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-22-TimeSignatures.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-App-01-SolfegeSyllables.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-App-02-RhythmicCountingSyllables.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-App-03-RememberForeverReviewFundamentals.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/01-App-04-MusicTheoryFundamentalsMoreResources.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/02-01-ChordInversionsAndFiguredBass.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/02-02-RomanNumerals.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/02-03-HarmonicProgressionDiagrams.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/02-04-ElementaryContrapuntalMotions.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/02-05-SATBPartWriting1VoicingTriads.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/02-06-SATBPartWriting2TheFiendishFive.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/02-07-SATBPartWriting3RootPositionTriads.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/02-08-SATBPartWriting4FirstInversionTriads.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/02-09-SATBPartWriting5SecondInversionTriads.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/02-10-SATBPartWriting6SeventhChords.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/02-11-NonchordTones.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/02-12-PartWritingChecklist.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/03-01-ModeMixtureAndChangeOfMode.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/03-02-SecondaryOrAppliedChords.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/03-03-TypesOfKeyRelationships.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/03-04-Modulation.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/03-05-NeapolitanChords.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/03-06-AugmentedSixthChords.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/03-07-SATBPartWriting7ChromaticPartWriting.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/03-08-ChromaticHarmonyRepresentativeExamples.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/03-09-EnharmonicReinterpretation.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/03-10-ChromaticHarmonyIdentifyingTheKey.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/03-11-HarmonicFunctionsByChordQuality.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/03-12-TypesOfMediantRelationships.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-01-01-ExtremelyShortJazzHistory.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-01-02-ThirdsMajorTriads.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-01-03-MinorTriads.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-01-04-CircleOfFifthsProgressions.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-01-05-OtherCommonTriadTypes.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-01-06-SpellingSeventhChords.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-01-07-BasicLeadSheetSymbols.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-01-08-ChordEqualsScale.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-01-09-AlterationsOfChordExtensions.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-01-10-HandleWithCareNotes.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-01-LeadSheetSymbols.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-02-01-FourNoteVoicings.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-02-02-IIVIinMajorKeys.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-02-03-TheAlteredDominant.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-02-04-IIVIinMinorKeys.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-02-05-BasicJazzScaleChordsSummary.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-02-ChordEqualsScale.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-03-01-TheModesOfMajor.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-03-02-TheModesOfMinor.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-03-BasicJazzScaleChords.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-04-01-StandardChangesBluesRhythmColtrane.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-04-02-IntroductionToReharmonization.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-04-BebopScales.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-05-TheAlteredDominant.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-App-01-TheChromaticScale.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-App-02-ParentScaleIndexChart.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-App-03-SlashNotationIndex.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-App-04-ParentScalesTrebleClef.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-App-05-ParentScalesBassClef.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-App-06-ParentScalesforPianoMajor.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-App-07-ParentScalesforPianoMinor.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-App-08-ParentScalesforPianoDiminished.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-App-09-ParentScalesforPianoWholeTone.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-App-10-TonicAndPredominantScaleChords.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-App-11-DominantFunctionScaleChords.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/04-App-12-BebopScales.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/05-01-FindingCadences.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/05-02-CadenceTypes.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/05-03-SmallerFormalUnits.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/05-04-SimplePartForms.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/05-05-CompoundPartFormsCompoundTernary.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/05-06-Rondo.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/05-07-SonataForm.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/05-08-FugueInventionCanon.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/05-09-AdditionalFormTermsAGlossary.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/05-10-SimplePartFormsExamples.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/05-11-CompoundTernarySongAndTrioExamples.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/05-12-RondoExamples.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/05-13-SonataFormExamples.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/06-01-OverviewOfContemporaryMusicHistory.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/06-02-DiatonicModes.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/06-03-AnalyzingDiatonicModes.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/06-04-AdditionalContemporaryScales.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/06-05-AnalyzingAdditionalScales.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/06-06-ParallelismPlaningImpressionism.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/06-07-ChordsHarmonicSonorities.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/06-08-RhythmMeter1Metric.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/06-09-RhythmMeter2Ametric.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/06-10-SetTheorySimplified.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/06-11-SymmetricSets.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/06-12-IntervalVectors.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/06-13-SurvivingSerialism1BasicTerminology.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/06-14-SurvivingSerialism2TranspositionSecrets.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/06-15-SurvivingSerialism3InversionRRISecrets.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/06-16-SurvivingSerialism4DerivationCombinatoriality.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/07-01-TonicizationPatternsMajorVER2.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/07-02-TonicizationPatternsMinorVER2.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/07-03-TonalIndexingExercises.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/07-04-BattlingTuplets.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/07-05-CoreTrichords.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/07-06-IntervalDrills.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/07-07-TwelveToneRowPractice2nds3rds4ths.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/07-08-AllIntervalRows.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/07-09-TwelveToneRowPractice4ths5ths6ths7ths.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/A-01-ChecklistOfTheoryKnowledge.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/A-02-AnalyticalTechniquesAPreliminaryExploration.pdf",
    "https://learnmusictheory.net/PDFs/pdffiles/A-03-PrepositionsInMusic.pdf",
]

def download_pdfs():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
    }

    print(f"Downloading {len(PDF_URLS)} PDFs...")
    print(f"Output directory: ./{OUTPUT_DIR}/\n")

    success = 0
    failed = []

    for i, url in enumerate(PDF_URLS, 1):
        filename = unquote(os.path.basename(url))
        filepath = os.path.join(OUTPUT_DIR, filename)

        print(f"[{i}/{len(PDF_URLS)}] {filename}")

        try:
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()

            with open(filepath, "wb") as f:
                f.write(response.content)

            success += 1
            time.sleep(0.3)

        except Exception as e:
            print(f"  ERROR: {e}")
            failed.append(filename)

    print(f"\n{'='*50}")
    print(f"Downloaded: {success}/{len(PDF_URLS)} PDFs")
    if failed:
        print(f"Failed ({len(failed)}):")
        for f in failed:
            print(f"  - {f}")
    print(f"\nFiles saved to: ./{OUTPUT_DIR}/")

if __name__ == "__main__":
    download_pdfs()
