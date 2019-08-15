.include "constants.inc"

.segment "CODE"
.import main
.export reset_handler
.proc reset_handler
  SEI
  CLD
  LDX #$00
  STX PPUCTRL
  STX PPUMASK
vblankwait:
  BIT PPUSTATUS
  BPL vblankwait

  LDA #$70
  STA $0200
  LDA #$05
  STA $0201
  LDA #$00
  STA $0202
  LDA #$80
  STA $0203

  JMP main
.endproc
