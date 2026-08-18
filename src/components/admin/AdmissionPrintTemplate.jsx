import React from 'react';
import { Printer, Download, ArrowLeft, CheckSquare, Square } from 'lucide-react';
import { downloadAsPDF, downloadAsPNG } from '../../utils/downloadHelper';

export default function AdmissionPrintTemplate({ data, onBack }) {
  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date();
  const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const formattedDay = currentDate.getDate();
  const formattedMonth = months[currentDate.getMonth()];
  const formattedYear = currentDate.getFullYear();

  const anexos = data.anexos || {};
  const hasAttachment = (key) => !!anexos[key];

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 text-slate-900 print:p-0 print:bg-white">
      {/* Botões de Ação no Topo (Ocultos na Impressão) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 text-sm font-medium py-2 px-3 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-sm px-4 py-2 rounded-xl shadow transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Ficha Oficial</span>
          </button>
        </div>
      </div>

      {/* Container das Páginas no formato folha A4 oficial */}
      <div className="max-w-4xl mx-auto space-y-8 print:space-y-0">
        
        {/* ===================== PÁGINA 1 ===================== */}
        <div className="bg-white p-8 sm:p-12 shadow-xl print:shadow-none print:p-8 border border-slate-300 print:border-none font-serif text-[12px] leading-snug page-break-after">
          
          {/* Cabeçalho Página 1 */}
          <div className="text-center pb-3 mb-4 border-b-2 border-slate-800">
            <h1 className="text-base font-bold uppercase tracking-wider text-slate-900">
              FICHA DE INFORMAÇÕES PARA ADMISSÃO DE FUNCIONÁRIO
            </h1>
            <p className="text-[11px] font-sans font-semibold text-slate-600 mt-0.5">Página 1 de 2</p>
          </div>

          {/* Dados Cadastrais Linha a Linha */}
          <div className="space-y-2 text-slate-900">
            <div className="flex border-b border-slate-300 pb-1">
              <span className="font-bold min-w-[70px]">Empresa:</span>
              <span className="flex-1 font-sans font-medium text-slate-800">{data.empresa || '________________________________________'}</span>
            </div>

            <div className="flex border-b border-slate-300 pb-1">
              <span className="font-bold min-w-[140px]">Nome do Funcionário:</span>
              <span className="flex-1 font-sans font-bold text-slate-900">{data.nomeFuncionario || '________________________________________'}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 border-b border-slate-300 pb-1">
              <div>
                <span className="font-bold">Nome de Mãe: </span>
                <span className="font-sans text-slate-800">{data.nomeMae || '______________________'}</span>
              </div>
              <div>
                <span className="font-bold">Pai: </span>
                <span className="font-sans text-slate-800">{data.nomePai || '______________________'}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-b border-slate-300 pb-1">
              <div>
                <span className="font-bold">Data Nasc.: </span>
                <span className="font-sans text-slate-800">{data.dataNascimento || '__ / __ / ____'}</span>
              </div>
              <div>
                <span className="font-bold">Estado Civil: </span>
                <span className="font-sans text-slate-800">{data.estadoCivil || '__________'}</span>
              </div>
              <div>
                <span className="font-bold">Nome Cônjuge: </span>
                <span className="font-sans text-slate-800">{data.nomeConjuge || '__________'}</span>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 border-b border-slate-300 pb-1">
              <div className="col-span-7">
                <span className="font-bold">Endereço: </span>
                <span className="font-sans text-slate-800">{data.endereco || '____________________'}</span>
              </div>
              <div className="col-span-2">
                <span className="font-bold">Nº.: </span>
                <span className="font-sans text-slate-800">{data.numero || '____'}</span>
              </div>
              <div className="col-span-3">
                <span className="font-bold">Complemento: </span>
                <span className="font-sans text-slate-800">{data.complemento || '____'}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-b border-slate-300 pb-1">
              <div>
                <span className="font-bold">Bairro: </span>
                <span className="font-sans text-slate-800">{data.bairro || '______________'}</span>
              </div>
              <div>
                <span className="font-bold">Cidade: </span>
                <span className="font-sans text-slate-800">{data.cidade || '______________'}</span>
              </div>
              <div>
                <span className="font-bold">Estado: </span>
                <span className="font-sans text-slate-800">{data.estado || '____'}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-b border-slate-300 pb-1">
              <div>
                <span className="font-bold">CEP: </span>
                <span className="font-sans text-slate-800">{data.cep || '_____-___'}</span>
              </div>
              <div>
                <span className="font-bold">Naturalidade: </span>
                <span className="font-sans text-slate-800">{data.naturalidade || '______________'}</span>
              </div>
              <div>
                <span className="font-bold">Estado: </span>
                <span className="font-sans text-slate-800">{data.naturalidadeEstado || '____'}</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 border-b border-slate-300 pb-1">
              <div>
                <span className="font-bold">CPF: </span>
                <span className="font-sans text-slate-800">{data.cpf || '___.___.___-__'}</span>
              </div>
              <div>
                <span className="font-bold">RG: </span>
                <span className="font-sans text-slate-800">{data.rg || '________'}</span>
              </div>
              <div>
                <span className="font-bold">Estado Emissor: </span>
                <span className="font-sans text-slate-800">{data.rgEmissor || '____'}</span>
              </div>
              <div>
                <span className="font-bold">Data emissão: </span>
                <span className="font-sans text-slate-800">{data.rgDataEmissao || '__/__/____'}</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 border-b border-slate-300 pb-1">
              <div>
                <span className="font-bold">CTPS nº.: </span>
                <span className="font-sans text-slate-800">{data.ctpsNumero || '______'}</span>
              </div>
              <div>
                <span className="font-bold">Série: </span>
                <span className="font-sans text-slate-800">{data.ctpsSerie || '______'}</span>
              </div>
              <div>
                <span className="font-bold">PIS: </span>
                <span className="font-sans text-slate-800">{data.pis || '___.___.___-__'}</span>
              </div>
              <div>
                <span className="font-bold">Data emissão: </span>
                <span className="font-sans text-slate-800">{data.ctpsDataEmissao || '__/__/____'}</span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 border-b border-slate-300 pb-1">
              <div>
                <span className="font-bold">N. Reservista: </span>
                <span className="font-sans text-slate-800">{data.reservistaNumero || '______'}</span>
              </div>
              <div>
                <span className="font-bold">Categoria: </span>
                <span className="font-sans text-slate-800">{data.reservistaCategoria || '____'}</span>
              </div>
              <div>
                <span className="font-bold">Título de eleitor: </span>
                <span className="font-sans text-slate-800">{data.tituloEleitor || '________'}</span>
              </div>
              <div>
                <span className="font-bold">Zona: </span>
                <span className="font-sans text-slate-800">{data.tituloZona || '___'}</span>
              </div>
              <div>
                <span className="font-bold">Seção: </span>
                <span className="font-sans text-slate-800">{data.tituloSecao || '___'}</span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 border-b border-slate-300 pb-1">
              <div className="col-span-2">
                <span className="font-bold">CNH nº: </span>
                <span className="font-sans text-slate-800">{data.cnhNumero || '__________'}</span>
              </div>
              <div>
                <span className="font-bold">Cat.: </span>
                <span className="font-sans text-slate-800">{data.cnhCategoria || '___'}</span>
              </div>
              <div>
                <span className="font-bold">Data Validade: </span>
                <span className="font-sans text-slate-800">{data.cnhValidade || '__/__/____'}</span>
              </div>
              <div>
                <span className="font-bold">Nacionalidade: </span>
                <span className="font-sans text-slate-800">{data.nacionalidade || 'Brasileira'}</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 border-b border-slate-300 pb-1">
              <div>
                <span className="font-bold">Cor da Pele: </span>
                <span className="font-sans text-slate-800">{data.corPele || '______'}</span>
              </div>
              <div>
                <span className="font-bold">Cor olhos: </span>
                <span className="font-sans text-slate-800">{data.corOlhos || '______'}</span>
              </div>
              <div>
                <span className="font-bold">Altura: </span>
                <span className="font-sans text-slate-800">{data.altura || '____'}</span>
              </div>
              <div>
                <span className="font-bold">Peso: </span>
                <span className="font-sans text-slate-800">{data.peso || '____'}</span>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 border-b border-slate-300 pb-1">
              <div className="col-span-5">
                <span className="font-bold">Escolaridade: </span>
                <span className="font-sans text-slate-800">{data.escolaridade || '__________________'}</span>
              </div>
              <div className="col-span-3">
                <span className="font-bold">Estudante: </span>
                <span className="font-sans">({data.estudante === 'Sim' ? 'X' : ' '}) Sim ({data.estudante === 'Não' ? 'X' : ' '}) Não</span>
              </div>
              <div className="col-span-4">
                <span className="font-bold">TEL.: </span>
                <span className="font-sans text-slate-800">{data.telefone || '(__) _____-____'}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-b border-slate-300 pb-1">
              <div>
                <span className="font-bold">Conselho Regional: </span>
                <span className="font-sans text-slate-800">{data.conselhoNome || '______'}</span>
              </div>
              <div>
                <span className="font-bold">Nº Registro: </span>
                <span className="font-sans text-slate-800">{data.conselhoNumero || '______'}</span>
              </div>
              <div>
                <span className="font-bold">Data Validade: </span>
                <span className="font-sans text-slate-800">{data.conselhoValidade || '__/__/____'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-b border-slate-300 pb-1">
              <div>
                <span className="font-bold">Deficiente: </span>
                <span className="font-sans">{data.deficiente === 'Sim' ? 'Sim' : 'Não'}</span>
              </div>
              <div>
                <span className="font-bold">Tipo de Deficiência: </span>
                <span className="font-sans text-slate-800">{data.tipoDeficiencia || 'Nenhum'}</span>
              </div>
            </div>
          </div>

          {/* Dependentes */}
          <div className="mt-4 pt-2 border-t-2 border-slate-800">
            <h3 className="font-bold text-[13px] uppercase tracking-wide mb-1">Dependentes:</h3>
            <div className="space-y-1 text-slate-900">
              {(data.dependentes && data.dependentes.length > 0) ? (
                data.dependentes.map((dep, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-1 text-[11px] border-b border-slate-200 pb-0.5">
                    <div className="col-span-5"><span className="font-bold">Nome: </span><span className="font-sans">{dep.nome}</span></div>
                    <div className="col-span-3"><span className="font-bold">CPF: </span><span className="font-sans">{dep.cpf}</span></div>
                    <div className="col-span-2"><span className="font-bold">Grau: </span><span className="font-sans">{dep.parentesco}</span></div>
                    <div className="col-span-2"><span className="font-bold">Nasc.: </span><span className="font-sans">{dep.dataNascimento}</span></div>
                  </div>
                ))
              ) : (
                <div className="text-[11px] text-slate-500 italic">Nenhum dependente informado.</div>
              )}
            </div>
          </div>

          {/* Dados Bancários */}
          <div className="mt-4 pt-2 border-t-2 border-slate-800">
            <h3 className="font-bold text-[13px] uppercase tracking-wide mb-1">DADOS BANCÁRIOS:</h3>
            <div className="grid grid-cols-4 gap-2 border-b border-slate-300 pb-1">
              <div>
                <span className="font-bold">BANCO: </span>
                <span className="font-sans text-slate-800">{data.banco || '__________'}</span>
              </div>
              <div>
                <span className="font-bold">Código da Agencia: </span>
                <span className="font-sans text-slate-800">{data.agencia || '______'}</span>
              </div>
              <div>
                <span className="font-bold">Tipo de Conta: </span>
                <span className="font-sans text-slate-800">{data.tipoConta || '__________'}</span>
              </div>
              <div>
                <span className="font-bold">nº da Conta: </span>
                <span className="font-sans text-slate-800">{data.contaNumero || '__________'}</span>
              </div>
            </div>
          </div>

          {/* ANEXAR AO PREENCHER A FICHA */}
          <div className="mt-4 pt-2 border-t-2 border-slate-800">
            <h3 className="font-bold text-[12px] uppercase tracking-wide mb-2">ANEXAR AO PREENCHER A FICHA:</h3>
            <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[10px] leading-tight font-sans text-slate-800">
              <div>( {hasAttachment('doc_rg') ? 'X' : ' '} ) Cópia do RG</div>
              <div>( {hasAttachment('doc_cpf') ? 'X' : ' '} ) Cópia do CPF</div>
              <div>( {hasAttachment('doc_titulo') ? 'X' : ' '} ) Cópia do Título de Eleitor</div>
              <div>( {hasAttachment('doc_reservista') ? 'X' : ' '} ) Cópia do Certificado de Reservista</div>
              <div>( {hasAttachment('doc_registro_profissional') ? 'X' : ' '} ) Cópia do Registro Profissional</div>
              <div>( {hasAttachment('doc_casamento') ? 'X' : ' '} ) Cópia da Certidão de Casamento (se for casado)</div>
              <div>( {hasAttachment('doc_filhos_nascimento') ? 'X' : ' '} ) Cópia da Certidão de Nascimento dos Filhos</div>
              <div>( {hasAttachment('doc_vacinacao') ? 'X' : ' '} ) Cópia da Carteira de Vacinação (Filhos de 0 a 07 anos)</div>
              <div>( {hasAttachment('doc_frequencia_escolar') ? 'X' : ' '} ) Cópia do Comprovante de freqüência escolar (Filhos de 07 a 14 anos)</div>
              <div>( {hasAttachment('doc_residencia') ? 'X' : ' '} ) Comprovante de Residência</div>
              <div>( {hasAttachment('doc_ctps') ? 'X' : ' '} ) Cópia da CTPS (parte da foto e verso)</div>
              <div>( {hasAttachment('doc_pis_fgts') ? 'X' : ' '} ) Cópia do Cartão do PIS/Pasep, extrato do FGTS OU Cartão do Cidadão</div>
              <div className="col-span-2">( {hasAttachment('foto_3x4') ? 'X' : ' '} ) Uma foto 3X4</div>
            </div>
          </div>
        </div>

        {/* ===================== PÁGINA 2 ===================== */}
        <div className="bg-white p-8 sm:p-12 shadow-xl print:shadow-none print:p-8 border border-slate-300 print:border-none font-serif text-[12px] leading-snug">
          
          {/* Cabeçalho Página 2 */}
          <div className="text-center pb-3 mb-4 border-b-2 border-slate-800">
            <h1 className="text-base font-bold uppercase tracking-wider text-slate-900">
              FICHA DE INFORMAÇÕES PARA ADMISSÃO DE FUNCIONÁRIO
            </h1>
            <p className="text-[11px] font-sans font-semibold text-slate-600 mt-0.5">Página 2 de 2</p>
          </div>

          <div className="space-y-3 text-slate-900">
            <div className="text-[11px] font-sans font-semibold">
              ( {hasAttachment('doc_aso') ? 'X' : ' '} ) Exame médico admissional
            </div>

            <div className="p-3 border border-slate-300 bg-slate-50 text-[11px] italic leading-relaxed text-justify">
              Portaria 01 do MTE - Art. 15° - Será inválida a Carteira de Trabalho e Previdência Social – CTPS que apresentar emendas, rasuras, falta ou troca de fotografias e que não contiver a impressão digital do titular, sua assinatura e assinatura do emissor, salvo exceções previstas no art. 4° e seus § 1° desta Portaria.
            </div>

            <p className="font-bold text-[12px] text-center my-3">
              Assumo inteira responsabilidade pelas informações aqui prestadas.
            </p>

            <div className="text-right text-[11px] my-4">
              {data.localidadeAssinatura || `${data.cidade || 'Campo Grande'}-${data.estado || 'MS'}`}, <strong>{formattedDay}</strong> de <strong>{formattedMonth}</strong> de <strong>{formattedYear}</strong>.
            </div>

            {/* Assinaturas */}
            <div className="grid grid-cols-2 gap-8 my-6 text-center">
              <div>
                <div className="h-16 flex items-center justify-center border-b border-slate-800 mb-1">
                  {data.assinaturaUrl || data.assinaturaFuncionario ? (
                    <img
                      src={data.assinaturaUrl || data.assinaturaFuncionario}
                      alt="Assinatura"
                      className="max-h-14 object-contain"
                    />
                  ) : (
                    <span className="text-slate-400 text-xs italic">Assinatura Digital</span>
                  )}
                </div>
                <span className="font-bold text-[11px] block">Assinatura do Funcionário</span>
                <span className="text-[10px] text-slate-600 font-sans">{data.nomeFuncionario}</span>
              </div>

              <div>
                <div className="h-16 border-b border-slate-800 mb-1 flex items-center justify-center"></div>
                <span className="font-bold text-[11px] block">Empregador</span>
                <span className="text-[10px] text-slate-600 font-sans">Assinatura do Empregador</span>
              </div>
            </div>

            {/* Dados para Admissão (RH) */}
            <div className="mt-6 pt-3 border-t-2 border-slate-800 space-y-2">
              <h3 className="font-bold text-[13px] uppercase tracking-wide mb-2">Dados para admissão:</h3>

              <div className="grid grid-cols-3 gap-2 border-b border-slate-300 pb-1">
                <div>
                  <span className="font-bold">Data de Admissão: </span>
                  <span className="font-sans text-slate-800">{data.dataAdmissao || '__/__/____'}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-bold">Função: </span>
                  <span className="font-sans font-bold text-slate-900">{data.funcao || '____________________'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-b border-slate-300 pb-1">
                <div>
                  <span className="font-bold">Salário: </span>
                  <span className="font-sans font-bold text-slate-900">{data.salario || 'R$ __________'}</span>
                </div>
                <div>
                  <span className="font-bold">Tipo de salário: </span>
                  <span className="font-sans">
                    ({data.tipoSalario === 'Mensal' ? 'X' : ' '}) mensal {' '}
                    ({data.tipoSalario === 'Semanal' ? 'X' : ' '}) semanal {' '}
                    ({data.tipoSalario === 'Quinzenal' ? 'X' : ' '}) quinzenal
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-b border-slate-300 pb-1">
                <div>
                  <span className="font-bold">Horário de Trabalho: </span>
                  <span className="font-sans text-slate-800">{data.horarioTrabalho || '__________'}</span>
                </div>
                <div>
                  <span className="font-bold">Intervalo: </span>
                  <span className="font-sans text-slate-800">{data.intervalo || 'das ___ às ___'}</span>
                </div>
                <div>
                  <span className="font-bold">Folga (dia da semana): </span>
                  <span className="font-sans text-slate-800">{data.folga || '__________'}</span>
                </div>
              </div>

              <div className="border-b border-slate-300 pb-1 text-[11px]">
                <span className="font-bold">Contrato de Experiência: </span>
                <span className="font-sans">
                  ({data.contratoExperiencia === '30 dias + 30 dias' ? 'X' : ' '}) 30 dias + 30 dias {' '}
                  ({data.contratoExperiencia === '45 dias + 45 dias' ? 'X' : ' '}) 45 dias + 45 dias {' '}
                  ({data.contratoExperiencia === '30 dias + 60 dias' ? 'X' : ' '}) 30 dias + 60 dias {' '}
                  ({data.contratoExperiencia === '90 dias' ? 'X' : ' '}) 90 dias {' '}
                  ({data.contratoExperiencia === 'Não vai fazer contrato de experiência' ? 'X' : ' '}) não vai fazer contrato de experiência
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 border-b border-slate-300 pb-1">
                <div>
                  <span className="font-bold">Vai receber Vale Transporte? </span>
                  <span className="font-sans">
                    ({data.valeTransporte === 'SIM' ? 'X' : ' '}) SIM ({data.valeTransporte === 'NÃO' ? 'X' : ' '}) NÃO
                  </span>
                </div>
                <div>
                  <span className="font-bold">Adiantamento Salarial (Vale dia 20): </span>
                  <span className="font-sans">
                    ({data.valeDia20 === 'SIM' ? 'X' : ' '}) SIM ({data.valeDia20 === 'NÃO' ? 'X' : ' '}) NÃO {data.valeDia20 === 'SIM' ? `(${data.valeDia20Percentual || '40%'})` : ''}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-b border-slate-300 pb-1">
                <div>
                  <span className="font-bold">Data do Exame Admissional: </span>
                  <span className="font-sans text-slate-800">{data.dataExameAdmissional || '__/__/____'}</span>
                </div>
                <div>
                  <span className="font-bold">Outros: </span>
                  <span className="font-sans text-slate-800">{data.outrasObservacoes || 'Nenhum'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SEÇÃO ORGANIZADA: DOCUMENTOS ANEXADOS ===================== */}
        {Object.keys(anexos).length > 0 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200 print:break-before-page">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-200">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center">
                  <Download className="w-5 h-5 mr-2 text-indigo-600" />
                  Documentos Anexados & Digitalizados ({Object.keys(anexos).length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Clique sobre qualquer documento para baixar instantaneamente como documento em PDF.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(anexos).map(([key, anexo]) => {
                if (!anexo) return null;
                const fileUrl = anexo.url || anexo.storageUrl;
                if (!fileUrl) return null;

                const isPdf = anexo.type === 'application/pdf' || (anexo.name && anexo.name.toLowerCase().endsWith('.pdf'));

                return (
                  <div
                    key={key}
                    className="group bg-slate-50 hover:bg-indigo-50/30 border border-slate-200 hover:border-indigo-300 rounded-2xl p-3.5 transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {isPdf ? 'PDF' : 'Imagem / Foto'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {anexo.name ? anexo.name.slice(-12) : 'anexo'}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-1 mb-2">
                        {anexo.title || key}
                      </h4>

                      {/* Preview Clicável para Baixar em PDF */}
                      <button
                        type="button"
                        onClick={() => downloadAsPDF(fileUrl, anexo.name || anexo.title, anexo.title)}
                        className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center cursor-pointer group-hover:scale-[1.02] transition-all shadow-xs"
                        title="Clique para baixar este documento como PDF"
                      >
                        {isPdf ? (
                          <div className="text-center p-3">
                            <Download className="w-8 h-8 text-rose-500 mx-auto mb-1" />
                            <span className="text-[11px] font-semibold text-slate-700 block truncate max-w-[140px]">
                              {anexo.name || 'Documento PDF'}
                            </span>
                          </div>
                        ) : (
                          <img
                            src={fileUrl}
                            alt={anexo.title || "Documento"}
                            className="w-full h-full object-cover"
                          />
                        )}

                        {/* Overlay Hover */}
                        <div className="absolute inset-0 bg-indigo-950/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-all">
                          <Download className="w-6 h-6 mb-1 animate-bounce" />
                          <span className="text-xs font-bold">Baixar como PDF</span>
                        </div>
                      </button>
                    </div>

                    {/* Botão de Ação Rápida */}
                    <button
                      type="button"
                      onClick={() => downloadAsPDF(fileUrl, anexo.name || anexo.title, anexo.title)}
                      className="mt-3 w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Baixar como PDF</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
